/**
 * Contact form functionality
 * Externalized from ContactForm.astro to improve text-to-HTML ratio
 */

const CONTACT_FORM_SELECTOR = '#contact-form';
const DECOY_COMPANY_SELECTOR = 'input[data-decoy-company]';
const FORM_LOADED_AT_SELECTOR = 'input[data-form-loaded-at]';

const initContactForm = () => {
  const form = document.querySelector(CONTACT_FORM_SELECTOR);

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const statusEl = form.querySelector('[data-status]');
  const submitButton = form.querySelector('button[type="submit"]');
  const honeypotInput = form.querySelector(DECOY_COMPANY_SELECTOR);
  const timestampInput = form.querySelector(FORM_LOADED_AT_SELECTOR);
  const resetTurnstile = () => window.turnstile?.reset();

  const statusClasses = {
    idle: 'text-ink/80',
    pending: 'text-amber-600',
    success: 'text-ink',
    error: 'text-rose-600'
  };

  const setStatus = (state, message) => {
    if (!(statusEl instanceof HTMLElement)) return;

    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.classList.remove(
      statusClasses.idle,
      statusClasses.pending,
      statusClasses.success,
      statusClasses.error
    );
    statusEl.classList.add(statusClasses[state]);
  };

  const ensureTrapFields = () => {
    const datasetTimestamp = typeof form.dataset.formLoadedAt === 'string' ? form.dataset.formLoadedAt : '';
    const datasetDate = datasetTimestamp && !Number.isNaN(Date.parse(datasetTimestamp)) ? datasetTimestamp : '';
    const timestamp = datasetDate || new Date().toISOString();

    form.dataset.formLoadedAt = timestamp;

    if (timestampInput instanceof HTMLInputElement) {
      timestampInput.value = timestamp;
    }

    if (honeypotInput instanceof HTMLInputElement && honeypotInput.value) {
      honeypotInput.value = '';
    }

    return timestamp;
  };

  ensureTrapFields();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!(statusEl instanceof HTMLElement) || !(submitButton instanceof HTMLButtonElement)) {
      return;
    }

    setStatus('pending', 'Sending your request…');
    submitButton.disabled = true;

    try {
      const timestamp = ensureTrapFields();
      const formData = new FormData(form);
      formData.append('page', window.location.href);
      formData.set('form_loaded_at', timestamp);

      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result?.success) {
        form.reset();
        setStatus('success', result.message ?? 'Thanks! We will contact you shortly.');
        resetTurnstile();
      } else {
        const message = result?.message ?? 'We were unable to send your request. Please try again later.';
        setStatus('error', message);
        resetTurnstile();
      }
    } catch (error) {
      console.error('Contact form submission failed', error);
      setStatus('error', 'A network error prevented submission. Please try again.');
      resetTurnstile();
    } finally {
      submitButton.disabled = false;
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm, { once: true });
} else if (typeof queueMicrotask === 'function') {
  queueMicrotask(initContactForm);
} else {
  setTimeout(initContactForm, 0);
}
