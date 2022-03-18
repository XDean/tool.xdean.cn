import { Idiom } from 'idiom';

type Props = {
  idiom: Idiom
}

export const IdiomHint = (props: Props) => {
  const {idiom} = props;
  return (
    <div className={'text-gray-600 mt-4'}>
      <div className={'flex flex-start'}>
        <div className={'font-bold whitespace-nowrap'}>出处：</div>
        <div>{idiom.derivation.replace(idiom.word, '～')}</div>
      </div>
      <div className={'flex flex-start'}>
        <div className={'font-bold whitespace-nowrap'}>示例：</div>
        <div>{idiom.example.replace(idiom.word, '～')}</div>
      </div>
    </div>
  );
};