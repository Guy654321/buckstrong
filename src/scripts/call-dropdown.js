const ROOT_SELECTOR = '[data-call-dropdown]';
const TOGGLE_SELECTOR = '[data-call-toggle]';
const MENU_SELECTOR = '[data-call-menu]';
const LINK_SELECTOR = '[data-call-link]';
const MARKET_OPTION_SELECTOR = '[data-market-option]';
const ACTIVE_INDICATOR_SELECTOR = '[data-active-indicator]';
const MARKET_DESCRIPTION_SELECTOR = '[data-call-market-description]';
const PHONE_TEXT_SELECTOR = '.nap-phone';

const getDocumentFromNode = (node) => {
  if (node && node.ownerDocument) {
    return node.ownerDocument;
  }
  if (typeof document !== 'undefined') {
    return document;
  }
  return null;
};

const CONTROLLERS = new WeakMap();

const formatDescription = (label, display) => {
  if (label && display) {
    return `for the ${label} market at ${display}`;
  }
  if (display) {
    return `at ${display}`;
  }
  return '';
};

class CallDropdownController {
  constructor(root) {
    if (!root) {
      throw new Error('CallDropdownController requires a root element');
    }

    this.root = root;
    this.document = getDocumentFromNode(root);
    this.toggle = root.querySelector(TOGGLE_SELECTOR);
    this.menu = root.querySelector(MENU_SELECTOR);
    this.link = root.querySelector(LINK_SELECTOR);
    this.description = root.querySelector(MARKET_DESCRIPTION_SELECTOR);
    this.options = Array.from(root.querySelectorAll(MARKET_OPTION_SELECTOR));
    this.state = 'closed';

    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleDocumentPointerDown = this.handleDocumentPointerDown.bind(this);
    this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);

    this.supportsPointerEvents = typeof window !== 'undefined' && 'PointerEvent' in window;
    this.pointerEventName = this.supportsPointerEvents ? 'pointerdown' : 'mousedown';

    this.registerEvents();
    this.updateMenuState(false);
    this.syncInitialSelection();
  }

  registerEvents() {
    if (this.toggle) {
      this.toggle.addEventListener('click', this.handleToggleClick);
      this.toggle.setAttribute('aria-expanded', 'false');
    }

    this.options.forEach((option) => {
      option.addEventListener('click', this.handleOptionClick);
    });
  }

  isOpen() {
    return this.state === 'open';
  }

  open() {
    if (this.isOpen()) {
      return;
    }
    this.state = 'open';
    this.updateMenuState(true);
    this.registerDocumentListeners();
    this.registerWindowListeners();
    this.focusActiveOption();
  }

  close() {
    if (!this.isOpen()) {
      return;
    }
    this.state = 'closed';
    this.updateMenuState(false);
    this.unregisterDocumentListeners();
    this.unregisterWindowListeners();
    if (typeof window !== 'undefined' && this.placementFrame) {
      window.cancelAnimationFrame(this.placementFrame);
      this.placementFrame = null;
    }
  }

  toggleMenu() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  updateMenuState(shouldOpen) {
    if (this.toggle) {
      this.toggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }
    if (!this.menu) {
      return;
    }
    this.menu.dataset.open = shouldOpen ? 'true' : 'false';
    this.menu.hidden = !shouldOpen;
    if (shouldOpen) {
      this.menu.removeAttribute('hidden');
      this.queuePlacementUpdate();
    } else if (!this.menu.hasAttribute('hidden')) {
      this.menu.setAttribute('hidden', '');
    }
  }

  registerDocumentListeners() {
    if (!this.document || this.documentListenersActive) {
      return;
    }
    this.document.addEventListener(this.pointerEventName, this.handleDocumentPointerDown, true);
    if (!this.supportsPointerEvents) {
      this.document.addEventListener('touchstart', this.handleDocumentPointerDown, true);
    }
    this.document.addEventListener('keydown', this.handleDocumentKeydown);
    this.documentListenersActive = true;
  }

  unregisterDocumentListeners() {
    if (!this.document || !this.documentListenersActive) {
      return;
    }
    this.document.removeEventListener(this.pointerEventName, this.handleDocumentPointerDown, true);
    if (!this.supportsPointerEvents) {
      this.document.removeEventListener('touchstart', this.handleDocumentPointerDown, true);
    }
    this.document.removeEventListener('keydown', this.handleDocumentKeydown);
    this.documentListenersActive = false;
  }

  registerWindowListeners() {
    if (typeof window === 'undefined' || this.windowListenersActive) {
      return;
    }
    window.addEventListener('resize', this.handleWindowResize);
    window.addEventListener('orientationchange', this.handleWindowResize);
    this.windowListenersActive = true;
  }

  unregisterWindowListeners() {
    if (typeof window === 'undefined' || !this.windowListenersActive) {
      return;
    }
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('orientationchange', this.handleWindowResize);
    this.windowListenersActive = false;
  }

  handleToggleClick(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    this.toggleMenu();
  }

  handleDocumentPointerDown(event) {
    if (!event || !this.isOpen()) {
      return;
    }
    const target = event.target;
    if (!target || !this.root.contains(target)) {
      this.close();
    }
  }

  handleDocumentKeydown(event) {
    if (!event) {
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      this.close();
      if (this.toggle && typeof this.toggle.focus === 'function') {
        this.toggle.focus();
      }
    }
  }

  handleOptionClick(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    const option = event?.currentTarget || event?.target?.closest?.(MARKET_OPTION_SELECTOR);
    if (!option) {
      return;
    }
    this.applySelection(option);
    this.close();
    if (this.toggle && typeof this.toggle.focus === 'function') {
      this.toggle.focus();
    }
  }

  syncInitialSelection() {
    const activeId = this.root.getAttribute('data-active-market-id');
    const activeOption = activeId ? this.findOptionById(activeId) : null;
    if (activeOption) {
      this.applySelection(activeOption);
      return;
    }
    if (this.options.length > 0) {
      this.applySelection(this.options[0]);
    }
  }

  findOptionById(marketId) {
    if (!marketId) {
      return null;
    }
    return this.options.find((option) => option.getAttribute('data-market-id') === marketId) || null;
  }

  applySelection(option) {
    if (!option) {
      return;
    }
    const marketId = option.getAttribute('data-market-id') || '';
    const phoneHref = option.getAttribute('data-market-phone') || '';
    const label = option.getAttribute('data-market-label') || '';
    const display = option.getAttribute('data-market-display') || '';

    if (marketId) {
      this.root.setAttribute('data-active-market-id', marketId);
    } else {
      this.root.removeAttribute('data-active-market-id');
    }

    this.updateLink({ phoneHref, label, display });
    this.updateOptions(option);
  }

  updateLink({ phoneHref, label, display }) {
    if (!this.link) {
      return;
    }
    if (phoneHref) {
      this.link.setAttribute('href', phoneHref);
    }
    if (label && display) {
      this.link.setAttribute('aria-label', `Call the ${label} market at ${display}`);
    } else if (display) {
      this.link.setAttribute('aria-label', `Call ${display}`);
    }
    if (this.description) {
      const text = formatDescription(label, display);
      this.description.textContent = text;
    }
    const phoneTargets = this.link.querySelectorAll(PHONE_TEXT_SELECTOR);
    if (phoneTargets.length > 0) {
      phoneTargets.forEach((node) => {
        node.textContent = display || '';
      });
    }
  }

  updateOptions(activeOption) {
    this.options.forEach((option) => {
      const isActive = option === activeOption;
      option.setAttribute('aria-checked', isActive ? 'true' : 'false');
      option.setAttribute('data-active', isActive ? 'true' : 'false');
      const indicator = option.querySelector(ACTIVE_INDICATOR_SELECTOR);
      if (indicator) {
        indicator.textContent = isActive ? 'Active' : 'Select';
        indicator.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      }
    });
  }

  focusActiveOption() {
    const activeId = this.root.getAttribute('data-active-market-id');
    const activeOption = activeId ? this.findOptionById(activeId) : null;
    const target = activeOption || this.options[0];
    if (target && typeof target.focus === 'function') {
      target.focus();
    }
  }

  queuePlacementUpdate() {
    if (typeof window === 'undefined') {
      return;
    }
    if (this.placementFrame) {
      window.cancelAnimationFrame(this.placementFrame);
    }
    this.placementFrame = window.requestAnimationFrame(() => {
      this.placementFrame = null;
      this.updateMenuPlacement();
    });
  }

  updateMenuPlacement() {
    if (!this.menu || typeof window === 'undefined') {
      return;
    }
    const doc = this.document || document;
    const viewportHeight = window.innerHeight || doc.documentElement?.clientHeight || 0;
    const rootRect = typeof this.root.getBoundingClientRect === 'function'
      ? this.root.getBoundingClientRect()
      : null;
    const menuHeight = this.menu.scrollHeight || this.menu.offsetHeight || 0;
    const prefersDropUp = typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-width: 640px)').matches
      : false;
    let shouldDropUp = prefersDropUp;

    if (!shouldDropUp && rootRect && menuHeight) {
      const buffer = 16;
      const spaceBelow = viewportHeight - rootRect.bottom;
      const spaceAbove = rootRect.top;
      if (menuHeight + buffer > spaceBelow && spaceAbove > spaceBelow) {
        shouldDropUp = true;
      }
    }

    this.menu.dataset.placement = shouldDropUp ? 'top' : 'bottom';
  }

  handleWindowResize() {
    if (!this.isOpen()) {
      return;
    }
    this.queuePlacementUpdate();
  }
}

const createController = (root) => {
  if (!root) {
    return null;
  }
  if (CONTROLLERS.has(root)) {
    return CONTROLLERS.get(root);
  }
  const controller = new CallDropdownController(root);
  CONTROLLERS.set(root, controller);
  return controller;
};

export const initCallDropdowns = (scope) => {
  const context = scope && typeof scope.querySelectorAll === 'function'
    ? scope
    : typeof document !== 'undefined'
      ? document
      : null;
  if (!context) {
    return [];
  }
  const roots = Array.from(context.querySelectorAll(ROOT_SELECTOR));
  return roots.map(createController).filter(Boolean);
};

const autoInit = () => {
  if (typeof document === 'undefined') {
    return;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initCallDropdowns(document);
    }, { once: true });
    return;
  }
  initCallDropdowns(document);
};

autoInit();

export default CallDropdownController;
