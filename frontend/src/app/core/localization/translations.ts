export const translations = {
  en: {
    'app.name': 'Expense Tracker', 'nav.dashboard': 'Dashboard', 'nav.categories': 'Categories',
    'nav.transactions': 'Transactions', 'nav.reports': 'Reports', 'nav.expand': 'Expand navigation',
    'nav.collapse': 'Collapse navigation', 'nav.open': 'Open navigation', 'account.openMenu': 'Open user menu',
    'account.logout': 'Logout', 'preferences.theme': 'Theme', 'preferences.language': 'Language',
    'theme.light': 'Use light theme', 'theme.dark': 'Use dark theme', 'language.english': 'English',
    'language.german': 'Deutsch', 'common.cancel': 'Cancel', 'common.delete': 'Delete',
  },
  de: {
    'app.name': 'Ausgabenplaner', 'nav.dashboard': 'Übersicht', 'nav.categories': 'Kategorien',
    'nav.transactions': 'Transaktionen', 'nav.reports': 'Berichte', 'nav.expand': 'Navigation erweitern',
    'nav.collapse': 'Navigation einklappen', 'nav.open': 'Navigation öffnen', 'account.openMenu': 'Benutzermenü öffnen',
    'account.logout': 'Abmelden', 'preferences.theme': 'Darstellung', 'preferences.language': 'Sprache',
    'theme.light': 'Helles Design verwenden', 'theme.dark': 'Dunkles Design verwenden', 'language.english': 'English',
    'language.german': 'Deutsch', 'common.cancel': 'Abbrechen', 'common.delete': 'Löschen',
  },
} as const;

export type AppLocale = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
