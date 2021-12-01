import {Die} from './Die';

export const DiceTable = ({values}: { values: number[][] }) => {
  return (
    <div className={'h-full w-full overflow-auto'}>
      <ul>
        {[...values].reverse().map((v, i) => (
          <li key={i} className={'mt-2 flex flex-row items-center justify-center'}>
            <div className={'px-2 text-xl'}>
              {values.length - i}.
            </div>
            {v.map((d, j) => (
              <Die key={j} value={d} className={'w-8 h-8 mr-2'}/>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};