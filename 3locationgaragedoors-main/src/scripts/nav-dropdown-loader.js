const navSelector = '[data-nav-root]';
const getNavRoot = () => document.querySelector(navSelector);

const loadDropdownModule = () => {
  const navRoot = getNavRoot();
  const navDropdownScriptUrl = navRoot?.dataset.navModule;
  
  if (!navRoot) {
    console.error('Navigation root element not found.');
    return;
  }
  
  if (!navDropdownScriptUrl) {
    console.error('Navigation dropdown module URL missing.');
    return;
  }
  
  import(/* @vite-ignore */ navDropdownScriptUrl)
    .then(module => {
      if (module && typeof module.setupNavDropdowns === 'function') {
        module.setupNavDropdowns();
      }
    })
    .catch(error => {
      console.error('Failed to load navigation dropdown module.', error);
    });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadDropdownModule, { once: true });
} else {
  loadDropdownModule();
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', loadDropdownModule);
}
