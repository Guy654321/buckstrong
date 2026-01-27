/**
 * Navigation dropdown functionality
 * Externalized from Nav.astro to improve text-to-HTML ratio
 */

const onReady = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
};

const initializeDropdowns = () => {
  const dropdowns = document.querySelectorAll('[data-dropdown]');
  const focusableSelector = [
    'a[href]:not([tabindex="-1"]):not([aria-hidden="true"])',
    'button:not([disabled]):not([tabindex="-1"]):not([aria-hidden="true"])',
    '[tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])'
  ].join(', ');
  const hoverCapable =
    typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover)').matches;
  const pointerEventsSupported = typeof window.PointerEvent === 'function';
  const hoverEnterEvent = pointerEventsSupported ? 'pointerenter' : 'mouseenter';
  const hoverLeaveEvent = pointerEventsSupported ? 'pointerleave' : 'mouseleave';
  const outsideEventTypes = pointerEventsSupported ? ['pointerdown'] : ['mousedown', 'touchstart'];

  dropdowns.forEach((dropdownEl) => {
    if (!(dropdownEl instanceof HTMLElement)) {
      return;
    }

    if (dropdownEl.dataset.dropdownInitialized === 'true') {
      return;
    }

    const trigger = dropdownEl.querySelector('[data-dropdown-trigger]');
    const panel = dropdownEl.querySelector('[data-dropdown-panel]');

    if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      return;
    }

    if (!dropdownEl.hasAttribute('data-open')) {
      dropdownEl.setAttribute('data-open', 'false');
    }

    const isInitiallyOpen = dropdownEl.getAttribute('data-open') === 'true';
    panel.hidden = !isInitiallyOpen;
    panel.dataset.open = isInitiallyOpen ? 'true' : 'false';
    trigger.setAttribute('aria-expanded', isInitiallyOpen ? 'true' : 'false');

    const getFocusableItems = () =>
      Array.from(panel.querySelectorAll(focusableSelector)).filter((item) => {
        if (!(item instanceof HTMLElement)) {
          return false;
        }

        if (
          item.hasAttribute('disabled') ||
          item.getAttribute('aria-hidden') === 'true' ||
          item.hasAttribute('hidden')
        ) {
          return false;
        }

        const rect = item.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

    const focusFirstItem = () => {
      const items = getFocusableItems();
      if (items.length > 0) {
        items[0].focus({ preventScroll: true });
      }
    };

    const focusLastItem = () => {
      const items = getFocusableItems();
      if (items.length > 0) {
        items[items.length - 1].focus({ preventScroll: true });
      }
    };

    let closeTimeoutId;

    const clearCloseTimer = () => {
      if (typeof closeTimeoutId === 'number') {
        window.clearTimeout(closeTimeoutId);
        closeTimeoutId = undefined;
      }
    };

    const openDropdown = ({ focus } = {}) => {
      clearCloseTimer();
      if (!panel.hidden) return;

      panel.hidden = false;
      panel.dataset.open = 'true';
      trigger.setAttribute('aria-expanded', 'true');
      dropdownEl.setAttribute('data-open', 'true');

      if (focus === 'first') {
        focusFirstItem();
      } else if (focus === 'last') {
        focusLastItem();
      }
    };

    const closeDropdown = ({ focusTrigger } = {}) => {
      clearCloseTimer();
      if (panel.hidden) return;

      panel.hidden = true;
      panel.dataset.open = 'false';
      trigger.setAttribute('aria-expanded', 'false');
      dropdownEl.setAttribute('data-open', 'false');

      if (focusTrigger) {
        trigger.focus({ preventScroll: true });
      }
    };

    const scheduleClose = () => {
      clearCloseTimer();
      closeTimeoutId = window.setTimeout(() => {
        if (!dropdownEl.contains(document.activeElement)) {
          closeDropdown();
        }
      }, 120);
    };

    const controller = typeof AbortController === 'function' ? new AbortController() : undefined;

    const addListener = (target, type, listener, options = {}) => {
      if (controller) {
        target.addEventListener(type, listener, { ...options, signal: controller.signal });
      } else {
        target.addEventListener(type, listener, options);
      }
    };

    const handleTriggerClick = () => {
      if (panel.hidden) {
        openDropdown();
      } else {
        closeDropdown();
      }
    };

    const handleTriggerKeydown = (event) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          openDropdown({ focus: 'first' });
          break;
        case 'ArrowUp':
          event.preventDefault();
          openDropdown({ focus: 'last' });
          break;
        case 'Enter':
        case ' ': {
          event.preventDefault();
          openDropdown({ focus: 'first' });
          break;
        }
        case 'Spacebar':
          event.preventDefault();
          openDropdown({ focus: 'first' });
          break;
        case 'Escape':
          if (!panel.hidden) {
            event.preventDefault();
            closeDropdown();
          }
          break;
        case 'Tab':
          if (!panel.hidden && !event.shiftKey) {
            event.preventDefault();
            focusFirstItem();
          }
          break;
        default:
          break;
      }
    };

    const handlePanelKeydown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDropdown({ focusTrigger: true });
        return;
      }

      if (event.key === 'Tab') {
        const items = getFocusableItems();

        if (items.length === 0) {
          closeDropdown();
          return;
        }

        const firstItem = items[0];
        const lastItem = items[items.length - 1];

        if (!event.shiftKey && event.target === lastItem) {
          closeDropdown();
        } else if (event.shiftKey && event.target === firstItem) {
          event.preventDefault();
          closeDropdown({ focusTrigger: true });
        }
      }
    };

    const handleFocusOut = (event) => {
      const next = event.relatedTarget;

      if (!(next instanceof HTMLElement) || !dropdownEl.contains(next)) {
        closeDropdown();
      }
    };

    const handlePointerDown = (event) => {
      if (!(event.target instanceof Node)) {
        return;
      }

      if (!dropdownEl.contains(event.target)) {
        closeDropdown();
      }
    };

    const handlePointerEnter = () => {
      clearCloseTimer();
      openDropdown();
    };

    const handlePointerLeave = (event) => {
      const nextTarget =
        'relatedTarget' in event && event.relatedTarget instanceof HTMLElement
          ? event.relatedTarget
          : null;

      if (nextTarget && dropdownEl.contains(nextTarget)) {
        return;
      }

      scheduleClose();
    };

    addListener(trigger, 'click', handleTriggerClick);
    addListener(trigger, 'keydown', handleTriggerKeydown);
    addListener(panel, 'keydown', handlePanelKeydown);
    addListener(dropdownEl, 'focusout', handleFocusOut);
    outsideEventTypes.forEach((eventType) => {
      addListener(document, eventType, handlePointerDown);
    });

    if (hoverCapable) {
      addListener(dropdownEl, hoverEnterEvent, handlePointerEnter);
      addListener(dropdownEl, hoverLeaveEvent, handlePointerLeave);
      addListener(panel, hoverEnterEvent, handlePointerEnter);
      addListener(panel, hoverLeaveEvent, handlePointerLeave);
    }

    dropdownEl.dataset.dropdownInitialized = 'true';

    const removeListeners = () => {
      if (controller) {
        controller.abort();
      } else {
        outsideEventTypes.forEach((eventType) => {
          document.removeEventListener(eventType, handlePointerDown);
        });
        dropdownEl.removeEventListener('focusout', handleFocusOut);
        trigger.removeEventListener('click', handleTriggerClick);
        trigger.removeEventListener('keydown', handleTriggerKeydown);
        panel.removeEventListener('keydown', handlePanelKeydown);
        if (hoverCapable) {
          dropdownEl.removeEventListener(hoverEnterEvent, handlePointerEnter);
          dropdownEl.removeEventListener(hoverLeaveEvent, handlePointerLeave);
          panel.removeEventListener(hoverEnterEvent, handlePointerEnter);
          panel.removeEventListener(hoverLeaveEvent, handlePointerLeave);
        }
      }

      delete dropdownEl.dataset.dropdownInitialized;
    };

    document.addEventListener('astro:before-swap', removeListeners, { once: true });
  });
};

export function setupNavDropdowns() {
  onReady(initializeDropdowns);
}

setupNavDropdowns();

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', setupNavDropdowns);
}
