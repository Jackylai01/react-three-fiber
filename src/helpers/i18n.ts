import { GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getI18nProps(
  context: GetStaticPropsContext,
  namespaces: string[] = ['common'],
) {
  const locale = context.locale || context.defaultLocale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, namespaces)),
    },
  };
}
