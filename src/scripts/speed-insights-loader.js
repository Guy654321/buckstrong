(() => {
  if (typeof window === 'undefined') {
    return;
  }

  const bootstrap = () => {
    const config = window.__SPEED_INSIGHTS_CONFIG__;
    if (!config) {
      return;
    }

    const { scriptSrc, endpoint } = config;

    if (!scriptSrc || !endpoint) {
      return;
    }

    const loaderMarker = 'inline-idle';
    const datasetName = '@vercel/speed-insights/astro';

    const ensureQueue = () => {
      if (typeof window.si !== 'function') {
        window.si = function (...params) {
          (window.siq = window.siq || []).push(params);
        };
      }
    };

    const injectSpeedInsights = () => {
      const existing = document.head.querySelector(
        'script[data-speed-insights-loader="' + loaderMarker + '"]'
      );

      if (existing instanceof HTMLScriptElement) {
        existing.dataset.route = window.location.pathname;
        return;
      }

      ensureQueue();

      const script = document.createElement('script');
      script.src = scriptSrc;
      script.defer = true;
      script.dataset.sdkn = datasetName;
      script.dataset.sdkv = 'inline';
      script.dataset.route = window.location.pathname;
      script.dataset.endpoint = endpoint;
      script.dataset.speedInsightsLoader = loaderMarker;
      script.onerror = () => {
        console.warn('[Speed Insights] Failed to load analytics script.', scriptSrc);
      };

      document.head.appendChild(script);
    };

    const scheduleInjection = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => injectSpeedInsights(), { timeout: 6000 });
      } else {
        window.setTimeout(() => injectSpeedInsights(), 0);
      }
    };

    if (document.readyState === 'complete') {
      scheduleInjection();
    } else {
      window.addEventListener('load', () => scheduleInjection(), { once: true });
    }

    window.addEventListener('astro:page-load', () => {
      const script = document.head.querySelector(
        'script[data-speed-insights-loader="' + loaderMarker + '"]'
      );

      if (script instanceof HTMLScriptElement) {
        script.dataset.route = window.location.pathname;
      }
    });
  };

  const scheduleBootstrap = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(bootstrap, { timeout: 2000 });
    } else {
      window.setTimeout(bootstrap, 150);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleBootstrap, { once: true });
  } else {
    scheduleBootstrap();
  }
})();
