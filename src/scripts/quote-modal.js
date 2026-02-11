const OPEN_CLASS = 'quote-modal-open';
const QUOTE_TEXT_PATTERN = /^get a quote$/i;

const normalize = (value) => value.replace(/\s+/g, ' ').trim();

class QuoteModalController {
  constructor(root) {
    this.root = root;
    this.id = root.id;
    this.dialog = root.querySelector('[data-quote-modal-dialog]');
    this.overlay = root.querySelector('[data-quote-modal-overlay]');
    this.closeButtons = Array.from(root.querySelectorAll('[data-quote-modal-close]'));
    this.focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');
    this.triggers = [];
    this.lastActiveElement = null;
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
  }

  init() {
    this.bindTriggers();

    this.overlay?.addEventListener('click', this.handleOverlayClick);
    this.closeButtons.forEach((button) => button.addEventListener('click', this.handleCloseClick));

    this.root.dataset.state = 'closed';
    this.root.setAttribute('aria-hidden', 'true');
    this.root.querySelectorAll('[data-state]').forEach((node) => {
      node.dataset.state = 'closed';
    });
  }

  bindTriggers() {
    const explicitTriggers = Array.from(
      document.querySelectorAll(`[data-quote-modal-trigger][aria-controls="${this.id}"]`)
    );

    const implicitTriggers = Array.from(document.querySelectorAll('a[href="/contact"]')).filter((anchor) => {
      if (anchor.hasAttribute('data-call-modal-trigger')) {
        return false;
      }

      const text = normalize(anchor.textContent || '');
      return QUOTE_TEXT_PATTERN.test(text);
    });

    const uniqueTriggers = Array.from(new Set([...explicitTriggers, ...implicitTriggers]));

    uniqueTriggers.forEach((trigger) => {
      if (!(trigger instanceof HTMLElement)) {
        return;
      }

      trigger.dataset.quoteModalTrigger = '';
      trigger.setAttribute('aria-controls', this.id);
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', this.handleTriggerClick);
    });

    this.triggers = uniqueTriggers;
  }

  open(source) {
    this.lastActiveElement = source instanceof HTMLElement ? source : document.activeElement;
    this.root.dataset.state = 'open';
    this.root.setAttribute('aria-hidden', 'false');
    this.root.querySelectorAll('[data-state]').forEach((node) => {
      node.dataset.state = 'open';
    });

    document.body.classList.add(OPEN_CLASS);
    document.addEventListener('keydown', this.handleKeydown);
    this.triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'true'));
    this.focusFirstElement();
  }

  close() {
    this.root.dataset.state = 'closed';
    this.root.setAttribute('aria-hidden', 'true');
    this.root.querySelectorAll('[data-state]').forEach((node) => {
      node.dataset.state = 'closed';
    });

    document.body.classList.remove(OPEN_CLASS);
    document.removeEventListener('keydown', this.handleKeydown);
    this.triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));

    if (this.lastActiveElement instanceof HTMLElement) {
      this.lastActiveElement.focus();
    }
  }

  focusFirstElement() {
    if (!(this.dialog instanceof HTMLElement)) {
      return;
    }

    const focusableElements = Array.from(this.dialog.querySelectorAll(this.focusableSelector)).filter(
      (element) => element instanceof HTMLElement && !element.hasAttribute('hidden')
    );

    const firstElement = focusableElements[0];
    if (firstElement instanceof HTMLElement) {
      firstElement.focus();
      return;
    }

    this.dialog.focus();
  }

  handleTriggerClick(event) {
    if (!(event.currentTarget instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    this.open(event.currentTarget);
  }

  handleOverlayClick(event) {
    event.preventDefault();
    this.close();
  }

  handleCloseClick(event) {
    event.preventDefault();
    this.close();
  }

  handleKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }
}

const initQuoteModal = () => {
  const roots = Array.from(document.querySelectorAll('[data-quote-modal]'));
  roots.forEach((root) => {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const controller = new QuoteModalController(root);
    controller.init();
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuoteModal, { once: true });
} else if (typeof queueMicrotask === 'function') {
  queueMicrotask(initQuoteModal);
} else {
  setTimeout(initQuoteModal, 0);
}
