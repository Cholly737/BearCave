import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { PushNotifications } from '@capacitor/push-notifications';
import {
  isFCMToken,
  NATIVE_PUSH_DISABLED,
  registerNativePushToken,
  subscribeNativePushToken,
} from './native-push';

type Plugin = Pick<typeof PushNotifications, 'addListener' | 'register'>;
type Handler = (payload: { value?: string; error?: string }) => void;

function fakePlugin(onRegister: (handlers: Map<string, Handler>) => void): {
  plugin: Plugin; removed: string[]; calls: string[];
} {
  const handlers = new Map<string, Handler>();
  const removed: string[] = [];
  const calls: string[] = [];
  const plugin = {
    addListener: async (name: string, callback: Handler) => {
      handlers.set(name, callback);
      calls.push(name);
      return { remove: async () => { removed.push(name); handlers.delete(name); } };
    },
    register: async () => { calls.push('register'); onRegister(handlers); },
  } as unknown as Plugin;
  return { plugin, removed, calls };
}

test('listeners are ready before an immediate registration response', async () => {
  const fake = fakePlugin(handlers => handlers.get('registration')!({ value: 'fcm:ios-token' }));
  assert.equal(await registerNativePushToken(fake.plugin, 'ios'), 'fcm:ios-token');
  assert.deepEqual(fake.calls, ['registration', 'registrationError', 'register']);
  assert.deepEqual(fake.removed, ['registration', 'registrationError']);
});

test('legacy iOS APNs tokens are rejected rather than saved as FCM tokens', async () => {
  const fake = fakePlugin(handlers => handlers.get('registration')!({ value: 'AB'.repeat(32) }));
  await assert.rejects(registerNativePushToken(fake.plugin, 'ios'), /updated iOS app/);
  assert.equal(fake.removed.length, 2);
  assert.equal(isFCMToken('AB'.repeat(32), 'ios'), false);
  assert.equal(isFCMToken('fcm:valid-token', 'ios'), true);
});

test('native registration failures are surfaced and listeners removed', async () => {
  const fake = fakePlugin(handlers => handlers.get('registrationError')!({ error: 'APNs registration failed' }));
  await assert.rejects(registerNativePushToken(fake.plugin, 'ios'), /APNs registration failed/);
  assert.equal(fake.removed.length, 2);
});

test('concurrent hooks share one registration', async () => {
  const fake = fakePlugin(handlers => handlers.get('registration')!({ value: 'fcm:shared-token' }));
  const first = registerNativePushToken(fake.plugin, 'ios');
  const second = registerNativePushToken(fake.plugin, 'ios');
  assert.equal(first, second);
  await Promise.all([first, second]);
  assert.equal(fake.calls.filter(call => call === 'register').length, 1);
});

const originalFetch = globalThis.fetch;
const storage = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  },
});
Object.defineProperty(globalThis, 'window', { configurable: true, value: new EventTarget() });

afterEach(() => {
  globalThis.fetch = originalFetch;
  storage.clear();
});

test('subscription is saved only after server acknowledgment, sharing concurrent requests', async () => {
  let requests = 0;
  globalThis.fetch = async () => {
    requests++;
    assert.equal(storage.get('fcmToken'), undefined);
    return new Response('{}', { status: 200 });
  };
  const first = subscribeNativePushToken('fcm:accepted');
  const second = subscribeNativePushToken('fcm:accepted');
  assert.equal(first, second);
  await Promise.all([first, second]);
  assert.equal(requests, 1);
  assert.equal(storage.get('fcmToken'), 'fcm:accepted');
});

test('server subscription failure does not leave an enabled token', async () => {
  globalThis.fetch = async () => new Response('{}', { status: 500 });
  await assert.rejects(subscribeNativePushToken('fcm:rejected'), /Failed to save/);
  assert.equal(storage.get('fcmToken'), undefined);
});

test('an explicit opt-out blocks automatic subscription', async () => {
  storage.set(NATIVE_PUSH_DISABLED, 'true');
  globalThis.fetch = async () => { throw new Error('Should not contact server'); };
  await assert.rejects(subscribeNativePushToken('fcm:disabled'), /Notifications are disabled/);
});

test('an opt-out while subscribing cancels the new server subscription', async () => {
  const requests: string[] = [];
  globalThis.fetch = async (url) => {
    requests.push(String(url));
    if (requests.length === 1) storage.set(NATIVE_PUSH_DISABLED, 'true');
    return new Response('{}', { status: 200 });
  };
  await assert.rejects(subscribeNativePushToken('fcm:cancelled'), /Notifications are disabled/);
  assert.deepEqual(requests, ['/api/notifications/subscribe', '/api/notifications/unsubscribe']);
  assert.equal(storage.get('fcmToken'), undefined);
});
