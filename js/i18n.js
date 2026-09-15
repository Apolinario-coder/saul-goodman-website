/**
 * i18n Language Manager
 * Automatically selects Portuguese (pt-BR) or English (en) based on user's device/browser,
 * allows manual switching and remembers choice in localStorage.
 */

(function () {
    const DEFAULT_LANG = 'en';
    const SUPPORTED_LANGS = ['pt-BR', 'en'];

    function detectUserLanguage() {
        // 1. Check localStorage if user manually chose before
        const storedLang = localStorage.getItem('saul_site_lang');
        if (storedLang && SUPPORTED_LANGS.includes(storedLang)) {
            return storedLang;
        }

        // 2. Detect device/browser language
        const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage || ''];
        for (const lang of browserLangs) {
            if (!lang) continue;
            const normalized = lang.toLowerCase();
            if (normalized.startsWith('pt')) {
                return 'pt-BR';
            }
            if (normalized.startsWith('en')) {
                return 'en';
            }
        }

        return DEFAULT_LANG;
    }

    function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;

        const dict = window.translations && window.translations[lang];
        if (!dict) return;

        // Save preference
        localStorage.setItem('saul_site_lang', lang);
        document.documentElement.lang = lang;

        // Translate all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) {
                // If the translation contains HTML tags (like <span> or <br>), use innerHTML
                if (dict[key].includes('<') && dict[key].includes('>')) {
                    el.innerHTML = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        });

        // Translate attributes if any (e.g. data-i18n-attr="placeholder:key")
        document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
            const rules = el.getAttribute('data-i18n-attr').split(';');
            rules.forEach((rule) => {
                const [attr, key] = rule.split(':');
                if (dict[key] !== undefined) {
                    el.setAttribute(attr.trim(), dict[key]);
                }
            });
        });

        // Update UI switcher active states
        document.querySelectorAll('.lang-btn').forEach((btn) => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Refresh ScrollTrigger to recalculate layout dimensions in case of line breaks changes
        if (window.ScrollTrigger) {
            setTimeout(() => {
                window.ScrollTrigger.refresh();
            }, 100);
        }
    }

    // Expose functions globally
    window.i18n = {
        setLanguage: setLanguage,
        getCurrentLang: () => document.documentElement.lang || 'en'
    };

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        const initialLang = detectUserLanguage();
        setLanguage(initialLang);

        // Bind language toggle buttons
        document.querySelectorAll('.lang-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const chosen = e.currentTarget.getAttribute('data-lang');
                if (chosen) {
                    setLanguage(chosen);
                }
            });
        });
    });
})();
