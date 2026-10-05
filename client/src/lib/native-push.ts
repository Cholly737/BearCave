import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import type { PluginListenerHandle } from '@capacitor/core';

type RegistrationPlugin = Pick<typeof PushNotifications, 'addListener' | 'register'>;

let registrationInFlight: Promise<string> | null = null;
const subscriptionsInFlight = new Map<string, Promise<string>>();

export const PUSH_STATE_CHANGED = 'bearcave-push-state-changed';
export const NATIVE_PUSH_DISABLED = 'nativePushDisabled';

export function isFCMToken(token: string, platform = Capacitor.getPlatform()): boolean {
  // Legacy iOS builds return an APNs hex token, which FCM cannot send to.
  return !!token && !(platform === 'ios' && /^[a-f0-9]+$/i.test(token));
}

export function subscribeNativePushToken(token: string): Promise<string> {
  if (!isFCMToken(token)) {
    return Promise.reject(new Error('Please install the updated iOS app to enable notifications.'));
  }
  if (localStorage.getItem(NATIVE_PUSH_DISABLED) === 'true') {
    return Promise.reject(new Error('Notifications are disabled.'));
  }
  const existing = subscriptionsInFlight.get(token);
  if (existing) return existing;

  const request = (async () => {
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) throw new Error('Failed to save the notification subscription. Please try again.');
    // An opt-out can happen while a launch-time subscription request is pending.
    if (localStorage.getItem(NATIVE_PUSH_DISABLED) === 'true') {
      const cancelled = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!cancelled.ok) throw new Error('Failed to cancel the pending notification subscription.');
      throw new Error('Notifications are disabled.');
    }
    localStorage.setItem('fcmToken', token);
    window.dispatchEvent(new Event(PUSH_STATE_CHANGED));
    return token;
  })();
  subscriptionsInFlight.set(token, request);
  void request.finally(() => subscriptionsInFlight.delete(token)).catch(() => {});
  return request;
}

// Share registrations across the notification prompt, settings and side menu.
export function registerNativePushToken(
  plugin: RegistrationPlugin = PushNotifications,
  platform = Capacitor.getPlatform(),
): Promise<string> {
  if (registrationInFlight) return registrationInFlight;
  const request = waitForRegistration(plugin, platform);
  registrationInFlight = request;
  void request.finally(() => {
    if (registrationInFlight === request) registrationInFlight = null;
  }).catch(() => {});
  return request;
}

async function waitForRegistration(plugin: RegistrationPlugin, platform: string): Promise<string> {
  const handles: PluginListenerHandle[] = [];
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let resolveToken!: (token: string) => void;
  let rejectToken!: (error: Error) => void;
  const tokenPromise = new Promise<string>((resolve, reject) => {
    resolveToken = resolve;
    rejectToken = reject;
  });
  // Attach a handler now, even if an event arrives while register() is pending.
  void tokenPromise.catch(() => {});

  try {
    handles.push(await plugin.addListener('registration', ({ value }) => {
      if (!isFCMToken(value, platform)) {
        rejectToken(new Error('Please install the updated iOS app to enable notifications.'));
        return;
      }
      resolveToken(value);
    }));
    handles.push(await plugin.addListener('registrationError', ({ error }) => {
      rejectToken(new Error(error || 'Native push registration failed'));
    }));
    timeout = setTimeout(() => rejectToken(new Error('Push registration timed out. Please try again.')), 30000);
    // Listeners MUST be installed before registering; iOS may return immediately.
    await plugin.register();
    return await tokenPromise;
  } finally {
    clearTimeout(timeout);
    await Promise.all(handles.map(handle => handle.remove()));
  }
}
