let deferredPrompt: any = null;
let _canInstall = false;
let _isOnline = navigator.onLine;
let installCbs: Array<(v: boolean) => void> = [];
let onlineCbs: Array<(v: boolean) => void> = [];

export function getCanInstall() { return _canInstall; }
export function getIsOnline() { return _isOnline; }

export function onInstallChange(cb: (v: boolean) => void) { installCbs.push(cb); }
export function onOnlineChange(cb: (v: boolean) => void) { onlineCbs.push(cb); }

export function initPWA() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    _canInstall = true;
    installCbs.forEach((fn) => fn(true));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    _canInstall = false;
    installCbs.forEach((fn) => fn(false));
  });

  window.addEventListener('online', () => {
    _isOnline = true;
    onlineCbs.forEach((fn) => fn(true));
  });

  window.addEventListener('offline', () => {
    _isOnline = false;
    onlineCbs.forEach((fn) => fn(false));
  });
}

export function promptInstall(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!deferredPrompt) { resolve(false); return; }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        _canInstall = false;
        installCbs.forEach((fn) => fn(false));
        resolve(true);
      } else {
        resolve(false);
      }
      deferredPrompt = null;
    });
  });
}
