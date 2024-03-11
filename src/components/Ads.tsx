import { useEffect } from 'react';

export const Ads = () => {
  useEffect(() => {
    const w = window as any;
    try {
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch (e) {
      console.log('Ads failed', e);
    }
  }, []);


  return (
    <ins className={'adsbygoogle'}
         style={{display: 'block'}}
         data-ad-client={'ca-pub-7804430263218291'}
         data-ad-slot={'6714809866'}
         data-ad-format={'auto'}
         data-full-width-responsive={'true'}
    />
  );
};