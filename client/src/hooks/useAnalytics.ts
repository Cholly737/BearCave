import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

function getDeviceId(): string {
  let deviceId = localStorage.getItem('bearcave_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('bearcave_device_id', deviceId);
  }
  return deviceId;
}

function getPlatform(): string {
  if (Capacitor.isNativePlatform()) {
    return Capacitor.getPlatform();
  }
  return 'web';
}

const QUEUE_STORAGE_KEY = 'bearcave_analytics_queue';

function loadQueue(): any[] {
  try {
    const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: any[]) {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch {}
}

let eventQueue: any[] = loadQueue();
let flushTimeout: ReturnType<typeof setTimeout> | null = null;
let isFlushing = false;

function flushEvents() {
  if (isFlushing || eventQueue.length === 0) return;
  isFlushing = true;

  const eventsToSend = [...eventQueue];
  eventQueue = [];
  saveQueue(eventQueue);

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: eventsToSend }),
  })
    .then((res) => {
      if (!res.ok) {
        eventQueue.push(...eventsToSend);
        saveQueue(eventQueue);
      }
    })
    .catch(() => {
      eventQueue.push(...eventsToSend);
      saveQueue(eventQueue);
    })
    .finally(() => {
      isFlushing = false;
    });
}

function queueEvent(event: any) {
  eventQueue.push(event);
  saveQueue(eventQueue);

  if (flushTimeout) clearTimeout(flushTimeout);
  flushTimeout = setTimeout(flushEvents, 2000);

  if (eventQueue.length >= 10) {
    flushEvents();
  }
}

export function trackEvent(
  eventType: string,
  page?: string,
  eventData?: Record<string, any>
) {
  queueEvent({
    eventType,
    page: page || window.location.pathname,
    eventData: eventData || null,
    deviceId: getDeviceId(),
    platform: getPlatform(),
    referrer: document.referrer || null,
  });
}

export function useAnalytics() {
  const location = useLocation();
  const lastPath = useRef('');

  useEffect(() => {
    if (location.pathname !== lastPath.current) {
      lastPath.current = location.pathname;
      trackEvent('page_view', location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    trackEvent('app_open');

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushEvents();
      }
    };

    const handleBeforeUnload = () => {
      flushEvents();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    if (eventQueue.length > 0) {
      flushEvents();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const trackClick = useCallback((elementName: string, page?: string) => {
    trackEvent('click', page, { element: elementName });
  }, []);

  const trackNotificationOpen = useCallback((notificationData?: Record<string, any>) => {
    trackEvent('notification_open', undefined, notificationData);
  }, []);

  return { trackEvent, trackClick, trackNotificationOpen };
}
