(function () {
  if (typeof window === 'undefined') {
    return;
  }

  const scriptEl = document.currentScript;
  const scriptSrc = scriptEl?.dataset?.scriptSrc;
  const endpoint = scriptEl?.dataset?.endpoint;

  if (!scriptSrc || !endpoint) {
    return;
  }

  window.__SPEED_INSIGHTS_CONFIG__ = {
    scriptSrc,
    endpoint
  };
})();
