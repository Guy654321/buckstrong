const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
];

export const FOCUSABLE_SELECTOR = FOCUSABLE_SELECTORS.join(',');

const getDocumentFromRoot = (root) => {
  if (root && root.ownerDocument) {
    return root.ownerDocument;
  }
  if (typeof document !== 'undefined') {
    return document;
  }
  return null;
};

export const getFocusableElements = (container) => {
  if (!container || typeof container.querySelectorAll !== 'function') {
    return [];
  }
  const nodes = container.querySelectorAll(FOCUSABLE_SELECTOR);
  return Array.from(nodes).filter((node) => {
    if (!node) {
      return false;
    }
    if (typeof node.getAttribute === 'function') {
      return node.getAttribute('tabindex') !== '-1';
    }
    return true;
  });
};

const toggleBodyScrollClass = (doc, shouldLock) => {
  if (!doc || !doc.body) {
    return;
  }
  const className = 'call-modal-open';
  const { body } = doc;
  if (body.classList && typeof body.classList.add === 'function') {
    if (shouldLock) {
      body.classList.add(className);
    } else {
      body.classList.remove(className);
    }
    return;
  }
  const classes = new Set((body.className || '').split(/\s+/).filter(Boolean));
  if (shouldLock) {
    classes.add(className);
  } else {
    classes.delete(className);
  }
  body.className = Array.from(classes).join(' ');
};

export class HeaderCallModalController {
  constructor(root) {
    if (!root) {
      throw new Error('A root element is required for HeaderCallModalController');
    }
    this.root = root;
    this.dialog = root.querySelector('[data-call-modal-dialog]') || null;
    this.overlay = root.querySelector('[data-call-modal-overlay]') || null;
    this.closeButtons = Array.from(root.querySelectorAll('[data-call-modal-close]'));
    this.document = getDocumentFromRoot(root);
    this.state = 'closed';
    this.previouslyFocused = null;

    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleFocusIn = this.handleFocusIn.bind(this);
    this.handleCloseClick = this.close.bind(this);

    this.shouldIgnoreOverlayClick = false;

    this.triggers = this.findTriggers();
    this.registerEvents();
    this.updateAriaHidden(false);
  }

  getDocument() {
    return this.document;
  }

  findTriggers() {
    const doc = this.getDocument();
    if (!doc || !this.root.id || typeof doc.querySelectorAll !== 'function') {
      return [];
    }
    const selector = `[data-call-modal-trigger][aria-controls="${this.root.id}"]`;
    return Array.from(doc.querySelectorAll(selector));
  }

  registerEvents() {
    this.triggers.forEach((trigger) => {
      trigger.addEventListener('click', this.handleTriggerClick);
      if (this.supportsPointerEvents()) {
        trigger.addEventListener('pointerup', this.handlePointerUp);
      } else if (this.supportsTouchFallback()) {
        trigger.addEventListener('touchend', this.handleTouchEnd);
      }
      trigger.setAttribute('aria-expanded', 'false');
    });
    if (this.overlay) {
      this.overlay.addEventListener('click', this.handleOverlayClick);
    }
    this.closeButtons.forEach((button) => {
      button.addEventListener('click', this.handleCloseClick);
    });
  }

  isOpen() {
    return this.state === 'open';
  }

  open() {
    const canHandleInteraction = Boolean(this.dialog);
    if (!canHandleInteraction || this.isOpen()) {
      return false;
    }
    this.previouslyFocused = this.getActiveElement();
    const opened = this.setState(true);
    if (!opened) {
      return false;
    }
    this.focusInitialElement();
    return true;
  }

  close(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    if (!this.isOpen()) {
      return false;
    }
    const closed = this.setState(false);
    if (!closed) {
      return false;
    }
    this.restoreFocus();
    return true;
  }

  handleTriggerClick(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }

    const hasNavigator = typeof navigator !== 'undefined';
    const hasWindow = typeof window !== 'undefined';
    const isMobileUserAgent =
      hasNavigator && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '');
    const isSmallViewport = hasWindow && typeof window.innerWidth === 'number' && window.innerWidth < 768;
    const isMobile = isMobileUserAgent || isSmallViewport;

    if (isMobile && this.dialog && typeof this.dialog.querySelectorAll === 'function') {
      const telLinks = this.dialog.querySelectorAll('a[href^="tel:"]');
      if (telLinks && telLinks.length === 1) {
        const href = telLinks[0] && telLinks[0].href;
        if (href && hasWindow && window.location) {
          window.location.href = href;
        }
        if (event && typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        return;
      }
    }

    const opened = this.open();
    if (opened && event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
  }

  handlePointerUp(event) {
    if (!event || event.pointerType !== 'touch') {
      return;
    }
    const opened = this.open();
    if (opened) {
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      this.guardOverlayFromPhantomClick();
    }
  }

  handleTouchEnd(event) {
    const opened = this.open();
    if (opened) {
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      this.guardOverlayFromPhantomClick();
    }
  }

  handleOverlayClick(event) {
    if (this.shouldIgnoreOverlayClick) {
      if (event && typeof event.stopPropagation === 'function') {
        event.stopPropagation();
      }
      return;
    }
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    this.close();
  }

  handleKeydown(event) {
    if (!event) {
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      this.close();
      return;
    }
    if (event.key === 'Tab') {
      this.maintainFocus(event);
    }
  }

  handleFocusIn(event) {
    if (!this.isOpen() || !this.dialog || !event) {
      return;
    }
    if (this.dialog.contains && !this.dialog.contains(event.target)) {
      this.focusInitialElement();
    }
  }

  maintainFocus(event) {
    const focusable = this.getFocusableElements();
    if (focusable.length === 0) {
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      this.focusDialog();
      return;
    }
    const doc = this.getDocument();
    const activeElement = doc ? doc.activeElement : null;
    const currentIndex = focusable.indexOf(activeElement);
    const lastIndex = focusable.length - 1;
    if (event.shiftKey) {
      if (currentIndex <= 0) {
        if (event && typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        focusable[lastIndex].focus();
      }
    } else {
      if (currentIndex === -1 || currentIndex >= lastIndex) {
        if (event && typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        focusable[0].focus();
      }
    }
  }

  supportsPointerEvents() {
    const doc = this.getDocument();
    return Boolean(doc && doc.defaultView && doc.defaultView.PointerEvent);
  }

  supportsTouchFallback() {
    const doc = this.getDocument();
    return Boolean(doc && doc.defaultView && 'ontouchstart' in doc.defaultView);
  }

  guardOverlayFromPhantomClick() {
    this.shouldIgnoreOverlayClick = true;
    const clearGuard = () => {
      this.shouldIgnoreOverlayClick = false;
    };
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(clearGuard);
      return;
    }
    Promise.resolve().then(clearGuard);
  }

  getFocusableElements() {
    return getFocusableElements(this.dialog);
  }

  focusInitialElement() {
    const focusable = this.getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
      return;
    }
    this.focusDialog();
  }

  focusDialog() {
    if (!this.dialog || typeof this.dialog.focus !== 'function') {
      return;
    }
    if (typeof this.dialog.getAttribute === 'function' && typeof this.dialog.setAttribute === 'function') {
      if (!this.dialog.getAttribute('tabindex')) {
        this.dialog.setAttribute('tabindex', '-1');
      }
    }
    this.dialog.focus();
  }

  getActiveElement() {
    const doc = this.getDocument();
    return doc ? doc.activeElement : null;
  }

  restoreFocus() {
    if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
      this.previouslyFocused.focus();
    }
    this.previouslyFocused = null;
  }

  updateAriaHidden(isOpen) {
    this.root.dataset.state = isOpen ? 'open' : 'closed';
    this.root.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    if (this.overlay) {
      this.overlay.dataset.state = isOpen ? 'open' : 'closed';
    }
    if (this.dialog) {
      this.dialog.dataset.state = isOpen ? 'open' : 'closed';
    }
    this.triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  setState(isOpen) {
    const doc = this.getDocument();
    try {
      if (isOpen) {
        if (doc) {
          doc.addEventListener('keydown', this.handleKeydown);
          doc.addEventListener('focusin', this.handleFocusIn);
        }
        toggleBodyScrollClass(doc, true);
      } else {
        if (doc) {
          doc.removeEventListener('keydown', this.handleKeydown);
          doc.removeEventListener('focusin', this.handleFocusIn);
        }
        toggleBodyScrollClass(doc, false);
      }
      this.state = isOpen ? 'open' : 'closed';
      this.updateAriaHidden(isOpen);
      return true;
    } catch (error) {
      if (isOpen) {
        this.logStateError(error);
      }
      return false;
    }
  }

  logStateError(error) {
    if (typeof console === 'undefined' || typeof console.error !== 'function') {
      return;
    }
    console.error('[header-call-modal] Failed to open call modal', error);
  }
}

export const initializeCallModalControllers = () => {
  if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') {
    return [];
  }
  const instances = [];
  const roots = document.querySelectorAll('[data-call-modal]');
  roots.forEach((root) => {
    if (!root.__headerCallModalController) {
      root.__headerCallModalController = new HeaderCallModalController(root);
    }
    instances.push(root.__headerCallModalController);
  });
  return instances;
};

const autoInit = () => {
  if (typeof document === 'undefined') {
    return;
  }
  const init = () => {
    initializeCallModalControllers();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
};

autoInit();
