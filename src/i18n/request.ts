import { getRequestConfig } from 'next-intl/server';
import { getIntlMessages } from './catalogs';
import { normalizeLocale } from './locales';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = normalizeLocale(await requestLocale);

  return {
    locale,
    messages: getIntlMessages(locale),
  };
});
