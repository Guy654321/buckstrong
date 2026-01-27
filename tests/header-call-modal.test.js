import test from 'node:test';
import assert from 'node:assert/strict';

const createClassList = () => {
  const classes = new Set();
  return {
    add(name) {
      classes.add(name);
    },
    remove(name) {
      classes.delete(name);
    },
    contains(name) {
      return classes.has(name);
    },
  };
};

function createDocumentStub() {
  const listeners = new Map();
  return {
    readyState: 'complete',
    body: { classList: createClassList(), className: '' },
    activeElement: null,
    triggers: [],
    modals: [],
    addEventListener(type, handler) {
      if (!listeners.has(type)) {
        listeners.set(type, new Set());
      }
      listeners.get(type).add(handler);
    },
    removeEventListener(type, handler) {
      const group = listeners.get(type);
      if (group) {
        group.delete(handler);
      }
    },
    dispatchEvent(event) {
      const handlers = listeners.get(event.type);
      if (!handlers) {
        return true;
      }
      handlers.forEach((handler) => handler(event));
      return true;
    },
    querySelectorAll(selector) {
      if (selector === '[data-call-modal]') {
        return this.modals;
      }
      if (selector.startsWith('[data-call-modal-trigger]')) {
        return this.triggers;
      }
      return [];
    },
  };
}

const baseDocumentStub = createDocumentStub();
global.document = baseDocumentStub;

const headerCallModalModulePromise = import('../src/scripts/header-call-modal.js');

const createEvent = (type, overrides = {}) => {
  const event = {
    type,
    defaultPrevented: false,
    propagationStopped: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
    stopPropagation() {
      this.propagationStopped = true;
    },
  };
  return { ...event, ...overrides };
};

const flushMicrotasks = () =>
  new Promise((resolve) => {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(resolve);
      return;
    }
    Promise.resolve().then(resolve);
  });

const createStubElement = (doc) => {
  const listeners = new Map();
  return {
    id: '',
    dataset: {},
    attributes: new Map(),
    ownerDocument: doc,
    children: [],
    focused: false,
    addEventListener(type, handler) {
      if (!listeners.has(type)) {
        listeners.set(type, new Set());
      }
      listeners.get(type).add(handler);
    },
    removeEventListener(type, handler) {
      const group = listeners.get(type);
      if (group) {
        group.delete(handler);
      }
    },
    dispatchEvent(event) {
      const handlers = listeners.get(event.type);
      if (!handlers) {
        return true;
      }
      handlers.forEach((handler) => handler(event));
      return true;
    },
    setAttribute(name, value) {
      this.attributes.set(name, String(value));
    },
    getAttribute(name) {
      return this.attributes.has(name) ? this.attributes.get(name) : null;
    },
    focus() {
      if (doc) {
        doc.activeElement = this;
      }
      this.focused = true;
    },
    contains(node) {
      return this.children.includes(node);
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
  };
};

const createModalFixture = () => {
  const documentStub = createDocumentStub();
  const overlay = createStubElement(documentStub);
  overlay.dataset = { state: 'closed' };
  const dialog = createStubElement(documentStub);
  dialog.dataset = { state: 'closed' };
  dialog.telLinks = [];
  const closeButton = createStubElement(documentStub);
  closeButton.focus = function focus() {
    documentStub.activeElement = this;
    this.focused = true;
  };
  dialog.children = [closeButton];
  dialog.querySelectorAll = (selector) => {
    if (typeof selector === 'string' && selector.startsWith('a[href^="tel:"]')) {
      return dialog.telLinks;
    }
    return dialog.children;
  };
  dialog.contains = (node) => node === dialog || dialog.children.includes(node);
  const root = createStubElement(documentStub);
  root.id = 'header-call-modal';
  root.dataset = { state: 'closed' };
  root.querySelector = (selector) => {
    if (selector === '[data-call-modal-overlay]') {
      return overlay;
    }
    if (selector === '[data-call-modal-dialog]') {
      return dialog;
    }
    return null;
  };
  root.querySelectorAll = (selector) => {
    if (selector === '[data-call-modal-close]') {
      return [closeButton];
    }
    return [];
  };
  root.contains = (node) =>
    node === root || node === dialog || node === overlay || dialog.children.includes(node);
  documentStub.modals = [root];
  const trigger = createStubElement(documentStub);
  trigger.focus = function focus() {
    documentStub.activeElement = this;
    this.focused = true;
  };
  documentStub.triggers = [trigger];
  return { document: documentStub, root, overlay, dialog, closeButton, trigger };
};

const getController = async () => {
  const module = await headerCallModalModulePromise;
  return module.HeaderCallModalController;
};

test('header call modal toggles open state and restores focus', async () => {
  const Controller = await getController();
  const fixture = createModalFixture();
  const controller = new Controller(fixture.root);

  fixture.trigger.focus();
  fixture.trigger.dispatchEvent(createEvent('click'));

  assert.strictEqual(fixture.root.dataset.state, 'open');
  assert.strictEqual(fixture.overlay.dataset.state, 'open');
  assert.strictEqual(fixture.document.body.classList.contains('call-modal-open'), true);
  assert.strictEqual(fixture.document.activeElement, fixture.closeButton);

  controller.close();
  assert.strictEqual(fixture.root.dataset.state, 'closed');
  assert.strictEqual(fixture.document.body.classList.contains('call-modal-open'), false);
  assert.strictEqual(fixture.document.activeElement, fixture.trigger);
});

test('mobile trigger with single tel link navigates directly without opening modal', async () => {
  const Controller = await getController();
  const fixture = createModalFixture();

  const telLink = createStubElement(fixture.document);
  telLink.href = 'tel:123';
  fixture.dialog.telLinks = [telLink];

  const originalWindow = global.window;
  const originalNavigator = global.navigator;
  const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(global, 'navigator');
  const originalWindowDescriptor = Object.getOwnPropertyDescriptor(global, 'window');

  Object.defineProperty(global, 'window', {
    value: { innerWidth: 375, location: { href: '' } },
    configurable: true,
    writable: true,
  });
  Object.defineProperty(global, 'navigator', {
    value: { userAgent: 'iPhone' },
    configurable: true,
    writable: true,
  });

  try {
    const controller = new Controller(fixture.root);
    const clickEvent = createEvent('click');

    controller.handleTriggerClick(clickEvent);

    assert.strictEqual(fixture.root.dataset.state, 'closed');
    assert.strictEqual(global.window.location.href, 'tel:123');
    assert.strictEqual(clickEvent.defaultPrevented, true);
  } finally {
    if (originalWindowDescriptor) {
      Object.defineProperty(global, 'window', originalWindowDescriptor);
    } else {
      delete global.window;
      if (typeof originalWindow !== 'undefined') {
        global.window = originalWindow;
      }
    }

    if (originalNavigatorDescriptor) {
      Object.defineProperty(global, 'navigator', originalNavigatorDescriptor);
    } else {
      delete global.navigator;
      if (typeof originalNavigator !== 'undefined') {
        global.navigator = originalNavigator;
      }
    }
  }
});

test('header call modal closes when overlay is pressed', async () => {
  const Controller = await getController();
  const fixture = createModalFixture();
  const controller = new Controller(fixture.root);

  controller.open();
  fixture.overlay.dispatchEvent(createEvent('click'));

  assert.strictEqual(fixture.root.dataset.state, 'closed');
});

test('header call modal closes on Escape key and returns focus to trigger', async () => {
  const Controller = await getController();
  const fixture = createModalFixture();
  const controller = new Controller(fixture.root);

  fixture.trigger.focus();
  controller.open();
  fixture.document.dispatchEvent(createEvent('keydown', { key: 'Escape' }));

  assert.strictEqual(fixture.root.dataset.state, 'closed');
  assert.strictEqual(fixture.document.activeElement, fixture.trigger);
});

test('header call modal opens when pointerup is fired for touch inputs', async () => {
  const Controller = await getController();
  const fixture = createModalFixture();
  fixture.document.defaultView = { PointerEvent: function PointerEvent() {} };
  const controller = new Controller(fixture.root);

  controller.close();
  fixture.trigger.dispatchEvent(createEvent('pointerup', { pointerType: 'touch' }));

  assert.strictEqual(fixture.root.dataset.state, 'open');
});

test('touch pointer interactions only prevent default when the modal opens', async () => {
  const Controller = await getController();
  const fixture = createModalFixture();
  fixture.document.defaultView = { PointerEvent: function PointerEvent() {} };
  const controller = new Controller(fixture.root);

  controller.close();
  const pointerEvent = createEvent('pointerup', {
    pointerType: 'touch',
    cancelable: true,
  });
  fixture.trigger.dispatchEvent(pointerEvent);

  assert.strictEqual(fixture.root.dataset.state, 'open');
  assert.strictEqual(pointerEvent.defaultPrevented, true);

  controller.close();
  controller.dialog = null;
  const failedEvent = createEvent('pointerup', {
    pointerType: 'touch',
    cancelable: true,
  });
  fixture.trigger.dispatchEvent(failedEvent);

  assert.strictEqual(failedEvent.defaultPrevented, false);
  assert.strictEqual(fixture.root.dataset.state, 'closed');
});

test('header call modal opens when touchend is fired on browsers without pointer events', async () => {
  const Controller = await getController();
  const fixture = createModalFixture();
  fixture.document.defaultView = { ontouchstart: null };
  const controller = new Controller(fixture.root);

  controller.close();
  fixture.trigger.dispatchEvent(createEvent('touchend'));

  assert.strictEqual(fixture.root.dataset.state, 'open');
});

test('overlay ignores phantom click immediately following pointer triggered open', async () => {
  const Controller = await getController();
  const fixture = createModalFixture();
  fixture.document.defaultView = { PointerEvent: function PointerEvent() {} };
  const controller = new Controller(fixture.root);

  controller.close();
  fixture.trigger.dispatchEvent(createEvent('pointerup', { pointerType: 'touch' }));

  assert.strictEqual(fixture.root.dataset.state, 'open');

  const phantomEvent = createEvent('click');
  fixture.overlay.dispatchEvent(phantomEvent);
  assert.strictEqual(fixture.root.dataset.state, 'open');
  assert.strictEqual(phantomEvent.propagationStopped, true);

  await flushMicrotasks();
  fixture.overlay.dispatchEvent(createEvent('click'));
  assert.strictEqual(fixture.root.dataset.state, 'closed');
});

test('overlay ignores phantom click immediately following touchend fallback open', async () => {
  const Controller = await getController();
  const fixture = createModalFixture();
  fixture.document.defaultView = { ontouchstart: null };
  const controller = new Controller(fixture.root);

  controller.close();
  fixture.trigger.dispatchEvent(createEvent('touchend'));

  assert.strictEqual(fixture.root.dataset.state, 'open');

  const phantomEvent = createEvent('click');
  fixture.overlay.dispatchEvent(phantomEvent);
  assert.strictEqual(fixture.root.dataset.state, 'open');
  assert.strictEqual(phantomEvent.propagationStopped, true);

  await flushMicrotasks();
  fixture.overlay.dispatchEvent(createEvent('click'));
  assert.strictEqual(fixture.root.dataset.state, 'closed');
});

test('overlay closes on first user tap after pointerup triggered open', async () => {
  const Controller = await getController();
  const fixture = createModalFixture();
  fixture.document.defaultView = { PointerEvent: function PointerEvent() {} };
  const controller = new Controller(fixture.root);

  controller.close();
  fixture.trigger.dispatchEvent(createEvent('pointerup', { pointerType: 'touch' }));

  await flushMicrotasks();
  fixture.overlay.dispatchEvent(createEvent('click'));

  assert.strictEqual(fixture.root.dataset.state, 'closed');
});

test('overlay closes on first user tap after touchend fallback open', async () => {
  const Controller = await getController();
  const fixture = createModalFixture();
  fixture.document.defaultView = { ontouchstart: null };
  const controller = new Controller(fixture.root);

  controller.close();
  fixture.trigger.dispatchEvent(createEvent('touchend'));

  await flushMicrotasks();
  fixture.overlay.dispatchEvent(createEvent('click'));

  assert.strictEqual(fixture.root.dataset.state, 'closed');
});
