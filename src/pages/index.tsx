import Scenes from '@components/Scenes';
import { GetStaticPropsContext } from 'next';
import { getI18nProps } from '../helpers/i18n';

export default function HomePage() {
  return (
    <>
      <Scenes />
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return await getI18nProps(context);
}
