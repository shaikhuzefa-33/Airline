/**
 * Huzefa Airlines — Theme Toggle (Dark / Light)
 * Persists preference in localStorage. Works across all pages.
 */
(function () {
    'use strict';

    const STORAGE_KEY = 'huzefa-theme';
    const DARK  = 'dark';
    const LIGHT = 'light';

    /* ── Apply theme immediately (before paint) to avoid flash ── */
    function getPreferred() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? LIGHT : DARK;
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        updateButtonUI(theme);
    }

    function updateButtonUI(theme) {
        const btn   = document.getElementById('themeToggleBtn');
        const icon  = document.getElementById('themeToggleIcon');
        const label = document.getElementById('themeToggleLabel');
        if (!btn) return;

        if (theme === LIGHT) {
            if (icon)  icon.className   = 'fa-solid fa-moon';
            if (label) label.textContent = 'Dark';
            btn.setAttribute('aria-label', 'Switch to dark mode');
            btn.setAttribute('title', 'Switch to dark mode');
        } else {
            if (icon)  icon.className   = 'fa-solid fa-sun';
            if (label) label.textContent = 'Light';
            btn.setAttribute('aria-label', 'Switch to light mode');
            btn.setAttribute('title', 'Switch to light mode');
        }
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || DARK;
        /* spin icon for tactile feedback */
        const icon = document.getElementById('themeToggleIcon');
        const btn  = document.getElementById('themeToggleBtn');
        if (btn)  btn.classList.add('switching');
        if (icon) { icon.classList.add('switching'); setTimeout(() => { icon.classList.remove('switching'); if (btn) btn.classList.remove('switching'); }, 450); }
        applyTheme(current === DARK ? LIGHT : DARK);
    }

    /* Apply immediately on script load */
    applyTheme(getPreferred());

    /* Wire up button after DOM is ready */
    function init() {
        const btn = document.getElementById('themeToggleBtn');
        if (btn) {
            btn.addEventListener('click', toggleTheme);
            updateButtonUI(getPreferred());
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
