import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ToolMetaLayout } from '../../src/components/layout/ToolMetaLayout';
import { tools } from '../../src/tools';
import Head from 'next/head';

export default function ToolPage() {
  const router = useRouter();
  const tool = useMemo(() => tools.find(e => e.id === router.query.id)!, [router]);
  if (tool.disableLayout) {
    return (
      <>
        <Head>
          <title>{tool.name} | XDean的百宝箱</title>
        </Head>
        <tool.content/>
      </>
    );
  }
  return (
    <ToolMetaLayout meta={tool}>
      <Head>
        <title>{tool.name} | XDean的百宝箱</title>
      </Head>
      <tool.content/>
    </ToolMetaLayout>
  );
}
export const getStaticProps: GetStaticProps = async _ => {
  return {
    props: {},
  };
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  return {
    paths: tools.map(e => ({params: {id: e.id}})),
    fallback: false,
  };
};