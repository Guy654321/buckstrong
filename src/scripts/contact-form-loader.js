const FORM_SELECTOR = 'form[data-contact-form]';
const MODULE_DATASET_KEY = 'contactFormModule';
const TURNSTILE_DATASET_KEY = 'turnstileSrc';
const TURNSTILE_SCRIPT_ATTRIBUTE = 'data-turnstile-script';
const DECOY_COMPANY_SELECTOR = 'input[data-decoy-company]';
const FORM_LOADED_AT_SELECTOR = 'input[data-form-loaded-at]';
const FORM_READY_DELAY_MS = 750;

const getForms = () =>
  Array.from(document.querySelectorAll(FORM_SELECTOR)).filter(
    (form) => form instanceof HTMLFormElement
  );

const populateTrapFields = () => {
  const forms = getForms();

  if (forms.length === 0) {
    window.setTimeout(populateTrapFields, FORM_READY_DELAY_MS);
    return;
  }

  const timestamp = new Date().toISOString();

  forms.forEach((form) => {
    form.dataset.formLoadedAt = timestamp;

    const honeypotInput = form.querySelector(DECOY_COMPANY_SELECTOR);

    if (honeypotInput instanceof HTMLInputElement) {
      honeypotInput.value = '';
      honeypotInput.dataset.populated = 'true';
    }

    const timestampInput = form.querySelector(FORM_LOADED_AT_SELECTOR);

    if (timestampInput instanceof HTMLInputElement) {
      timestampInput.value = timestamp;
      timestampInput.dataset.populated = 'true';
    }
  });
};

const scheduleTrapFields = () => {
  const schedule = () => {
    window.setTimeout(populateTrapFields, FORM_READY_DELAY_MS);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
};

const getModuleUrl = () => {
  const forms = getForms();

  for (const form of forms) {
    const url = form.dataset?.[MODULE_DATASET_KEY];
    if (url) return url;
  }

  throw new Error('Contact form module URL not found in dataset attributes.');
};

const contactFormModuleUrl = getModuleUrl();

scheduleTrapFields();

let loaded = false;
let turnstileScriptLoaded = false;

const getTurnstileScriptSrc = () => {
  const forms = getForms();

  for (const form of forms) {
    const src = form.dataset?.[TURNSTILE_DATASET_KEY];
    if (typeof src === 'string' && src.trim()) {
      return src.trim();
    }
  }

  return '';
};

const loadTurnstileScript = () => {
  if (turnstileScriptLoaded) return;
  const existing = document.querySelector(`script[${TURNSTILE_SCRIPT_ATTRIBUTE}]`);
  if (existing) {
    turnstileScriptLoaded = true;
    return;
  }

  const src = getTurnstileScriptSrc();
  if (!src) return;

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;
  script.setAttribute(TURNSTILE_SCRIPT_ATTRIBUTE, 'true');
  script.crossOrigin = 'anonymous';
  script.referrerPolicy = 'strict-origin-when-cross-origin';
  script.addEventListener('load', () => {
    turnstileScriptLoaded = true;
  });
  script.addEventListener('error', () => {
    turnstileScriptLoaded = false;
  });

  document.head.appendChild(script);
};

const loadModule = () => {
  if (loaded) return;
  loaded = true;
  import(/* @vite-ignore */ contactFormModuleUrl);
};

const loadInteractivity = () => {
  loadTurnstileScript();
  loadModule();
};

const attach = () => {
  const forms = getForms();
  if (forms.length === 0) return;

  forms.forEach((form) => {
    if (form.dataset.contactFormLoaderAttached === 'true') {
      return;
    }

    form.dataset.contactFormLoaderAttached = 'true';

    ['focusin', 'input', 'submit'].forEach((eventName) => {
      form.addEventListener(eventName, loadInteractivity, { once: true });
    });

    ['pointerenter', 'touchstart'].forEach((eventName) => {
      form.addEventListener(eventName, loadInteractivity, {
        once: true,
        passive: true
      });
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            loadInteractivity();
          }
        },
        { rootMargin: '200px' }
      );

      observer.observe(form);
    }
  });
};

const scheduleAttach = () => {
  attach();

  if ('requestIdleCallback' in window) {
    requestIdleCallback(attach, { timeout: 1500 });
  } else {
    window.setTimeout(attach, 120);
  }

  loadTurnstileScript();
  loadModule();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleAttach, { once: true });
} else {
  scheduleAttach();
}
