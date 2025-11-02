/**
 * Service Worker Registration
 * 
 * Enables offline support and caching for the application.
 */

import { logger } from './logger';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';

      // First, attempt to unregister existing service workers that may contain
      // older install logic (for example using cache.addAll) which can fail and
      // keep serving old JS bundles. We do this proactively, then register a
      // fresh service worker instance.
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => {
          return Promise.all(
            registrations.map((reg) => reg.unregister().catch(() => false))
          );
        })
        .catch(() => [])
        .then(() => {
          return navigator.serviceWorker.register(swUrl);
        })
        .then((registration) => {
          logger.info('ServiceWorker registered', { scope: registration.scope });

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available, show update prompt
                logger.info('New content available, please refresh');

                // Optionally show UI notification
                if (window.confirm('Доступна новая версия приложения. Обновить?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((error) => {
          logger.error('ServiceWorker registration failed', error);
        });

      // Listen for controllerchange - new SW activated
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        logger.info('ServiceWorker controller changed, reloading...');
        window.location.reload();
      });
    });
  } else {
    logger.warn('ServiceWorker not supported in this browser');
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        logger.info('ServiceWorker unregistered');
      })
      .catch((error) => {
        logger.error('ServiceWorker unregistration failed', error);
      });
  }
}

// Check if the app is running in standalone mode (installed as PWA)
export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

// Check if the user is online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Listen for online/offline events
export function setupConnectivityListeners(
  onOnline?: () => void,
  onOffline?: () => void
) {
  window.addEventListener('online', () => {
    logger.info('App is online');
    onOnline?.();
  });

  window.addEventListener('offline', () => {
    logger.warn('App is offline');
    onOffline?.();
  });
}
