import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export const useLanguage = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    router.push(router.pathname, router.asPath, { locale: lng });
  };

  return {
    t,
    changeLanguage,
  };
};
