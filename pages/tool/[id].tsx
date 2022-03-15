import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ToolLayout } from '../../src/components/layout/ToolLayout';
import { tools } from '../../src/tools';

export default function ToolPage() {
  const router = useRouter();
  const tool = useMemo(() => tools.find(e => e.id === router.query.id)!, [router]);
  return (
    <ToolLayout meta={tool}>
      <tool.content/>
    </ToolLayout>
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