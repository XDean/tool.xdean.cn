import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import logo from '../../../public/tool/tax/logo.png';
import { Tool } from '../index';

// see https://github.com/XDean/blog.xdean.cn/blob/main/pages/posts/2021/tax/
export const TaxMain = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('https://blog.xdean.cn/posts/2021/tax')
      .then();
  }, [router]);
  return <div>正在跳转</div>;
};

export const Tax: Tool = {
  id: 'tax',
  name: '个税计算器',
  icon: () => <Image src={logo} layout={'responsive'} className={'rounded-full'}/>,
  content: TaxMain,
};