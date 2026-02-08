(function () {
  if (typeof window === 'undefined') {
    return;
  }

  const scriptEl = document.currentScript;
  const measurementId = scriptEl?.dataset?.measurementId;
  if (!measurementId) {
    return;
  }

  const consentKey = scriptEl.dataset?.consentKey || 'buckstrong:analytics-opt-in';

  const hasPrivacySignals = () => {
    const nav = window.navigator || {};
    const dntValues = new Set(['1', 'yes']);
    const gpcEnabled = Boolean(nav.globalPrivacyControl);
    return (
      gpcEnabled ||
      dntValues.has(String(window.doNotTrack)) ||
      dntValues.has(String(nav.doNotTrack)) ||
      dntValues.has(String(nav.msDoNotTrack))
    );
  };

  if (hasPrivacySignals()) {
    return;
  }

  const getStoredConsent = () => {
    try {
      return window.localStorage && window.localStorage.getItem(consentKey) === 'true';
    } catch (error) {
      return false;
    }
  };

  const persistConsent = () => {
    try {
      window.localStorage && window.localStorage.setItem(consentKey, 'true');
    } catch (error) {
      /* ignore storage errors */
    }
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  const loadScript = () => {
    if (document.getElementById('gtag-js')) {
      return;
    }
    const script = document.createElement('script');
    script.id = 'gtag-js';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    script.async = true;
    document.head.appendChild(script);
  };

  const activateAnalytics = () => {
    if (window.__gtagLoaderInvoked) {
      return;
    }
    window.__gtagLoaderInvoked = true;
    loadScript();
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
  };

  const enableAnalytics = () => {
    persistConsent();
    activateAnalytics();
  };

  if (getStoredConsent()) {
    activateAnalytics();
    return;
  }

  const interactionEvents = ['pointerdown', 'keydown', 'scroll'];
  const onFirstInteraction = () => {
    enableAnalytics();
  };

  interactionEvents.forEach((eventName) => {
    window.addEventListener(eventName, onFirstInteraction, {
      once: true,
      passive: true
    });
  });

  window.addEventListener(
    'analytics:opt-in',
    () => {
      enableAnalytics();
    },
    { once: true }
  );

  window.buckStrongAnalytics = Object.assign(window.buckStrongAnalytics || {}, {
    optIn: enableAnalytics
  });
})();
