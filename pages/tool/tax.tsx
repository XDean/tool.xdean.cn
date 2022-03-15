import {ToolMetaInline} from '../../src/lib/meta';
import logo from 'public/tool/tax/logo.png';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

const Tax = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('https://blog.xdean.cn/posts/2021/tax');
  }, [router]);
  return null;
};

export default Tax;

(Tax as any).meta = {
  id: 'tax',
  name: '个税计算器',
  icon: logo,
} as ToolMetaInline;