(function () {
  if (typeof window === 'undefined') {
    return;
  }

  const scriptEl = document.currentScript;
  const measurementId = scriptEl?.dataset?.measurementId;
  const openAiAdsPixelId = scriptEl?.dataset?.openaiAdsPixelId;
  if (!measurementId && !openAiAdsPixelId) {
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

  const loadGoogleAnalytics = () => {
    if (!measurementId || window.__gtagLoaderInvoked) {
      return;
    }
    window.__gtagLoaderInvoked = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    if (document.getElementById('gtag-js')) {
      return;
    }
    const script = document.createElement('script');
    script.id = 'gtag-js';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    script.async = true;
    document.head.appendChild(script);
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
  };

  const loadOpenAiAdsPixel = () => {
    if (!openAiAdsPixelId || window.__openAiAdsLoaderInvoked) {
      return;
    }
    window.__openAiAdsLoaderInvoked = true;

    if (!window.oaiq) {
      const queue = function oaiq() {
        queue.q.push(arguments);
      };
      queue.q = [];
      window.oaiq = queue;
    }

    if (!document.getElementById('openai-ads-pixel-js')) {
      const script = document.createElement('script');
      script.id = 'openai-ads-pixel-js';
      script.src = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
      script.async = true;
      document.head.appendChild(script);
    }

    window.oaiq('consent', true);
    window.oaiq('init', { pixelId: openAiAdsPixelId });
    window.oaiq('measure', 'page_viewed', {
      type: 'contents',
      contents: [
        {
          id: window.location.pathname || '/',
          name: document.title || 'Buck Strong Garage Doors',
          content_type: 'page'
        }
      ]
    });
  };

  const activateAnalytics = () => {
    loadGoogleAnalytics();
    loadOpenAiAdsPixel();
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
