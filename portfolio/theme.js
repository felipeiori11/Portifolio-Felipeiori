// Apply the preference before styles load to avoid a flash of the wrong theme.
(() => {
  const storageKey = 'portfolio-theme';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch { /* Theme selection still works when storage is unavailable. */ }

  function applyTheme() {
    const theme = preference || (systemTheme.matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#080808' : '#f5f5f5');
    document.querySelectorAll('[data-theme-option]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeOption === theme));
    });
  }

  applyTheme();
  systemTheme.addEventListener('change', () => { if (!preference) applyTheme(); });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-theme-option]').forEach(button => {
      button.addEventListener('click', () => {
        preference = button.dataset.themeOption;
        applyTheme();
        try { localStorage.setItem(storageKey, preference); } catch { /* Keep the in-memory choice. */ }
      });
    });
    applyTheme();
    document.querySelector('.theme-switch').hidden = false;
  });
})();
