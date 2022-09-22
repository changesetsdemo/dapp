/* eslint-disable import/no-extraneous-dependencies */
import { DEFAULT_LOCALE, SupportedLocale } from '@constants/i18n';
import { i18n } from '@lingui/core';
import { I18nProvider as LinguiI18nProvider } from '@lingui/react';
import { localeAtom } from '@states/index';
import { Events } from '@utils/events';
import { useAtom } from 'jotai';
import { en, PluralCategory, zh } from 'make-plural/plurals';
import { ReactNode, useEffect } from 'react';

type LocalePlural = {
  [key in SupportedLocale]: (n: number | string, ord?: boolean) => PluralCategory;
};

const plurals: LocalePlural = {
  'en-US': en,
  'zh-TW': zh,
};

i18n.loadLocaleData('undefined', { plurals: () => plurals['en-US'] });

export async function dynamicActivate(locale: SupportedLocale) {
  i18n.loadLocaleData(locale, { plurals: () => plurals[locale] });

  const catalog = await import(`@lingui/loader!./../locales/${locale}.json?raw-lingui`);
  i18n.load(locale, catalog.messages);
  i18n.activate(locale);
}

let i18nInit = false;

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useAtom(localeAtom);

  useEffect(() => {
    dynamicActivate(locale)
      .then(() => {
        if (!i18nInit) {
          const localeLang = Events.getLocalStorage(Events.LOCALE_LANG) || DEFAULT_LOCALE;
          setLocale(localeLang as SupportedLocale);
        }
        Events.setLocalStorage(Events.LOCALE_LANG, locale);
        i18n.activate(locale);
        i18nInit = true;
      })
      .catch(error => {
        console.error('Failed to activate locale', locale, error);
      });
  }, [locale, setLocale]);

  return (
    <>
      <LinguiI18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
        {children}
      </LinguiI18nProvider>
    </>
  );
}
