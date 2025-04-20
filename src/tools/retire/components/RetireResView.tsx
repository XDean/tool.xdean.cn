import { FC } from 'react';
import { RetireInput, RetireRes } from '../model/retire';

type Props = {
  input: RetireInput
  res: RetireRes;
};

const nf = new Intl.NumberFormat('zh-CN', {
  maximumFractionDigits: 2,
});

function format(v: number): string {
  const abs = Math.abs(v);
  if (abs > 1e12) {
    return nf.format(v / 1e12) + '万亿';
  } else if (abs > 1e8) {
    return nf.format(v / 1e8) + '亿';
  } else if (abs > 1e4) {
    return nf.format(v / 1e4) + '万';
  } else {
    return nf.format(v);
  }
}

export const RetireResView: FC<Props> = ({input, res}) => {
  if (!res) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      <div className={'border shadow p-2'}>
        <div className={'text-lg text-center'}>
          总览
        </div>
        <div className={'grid grid-cols-3 text-right gap-x-2 gap-y-1'}>
          <div className={'text-center border p-1 rounded'}>
            <div className={'text-base'}>
              {res.minRetireAge === -1 ? '♾️' : res.minRetireAge} 岁
            </div>
            <div className={'text-xs text-gray-500'}>
              最早退休年龄
            </div>
          </div>
          <div className={'text-center border p-1 rounded'}>
            <div className={'text-base'}>
              {format(res.years[0].nowNeed)}
            </div>
            <div className={'text-xs text-gray-500'}>
              立即退休需要
            </div>
          </div>
          <div className={'text-center border p-1 rounded'}>
            <div className={'text-base'}>
              {format(res.endValue)}
            </div>
            <div className={'text-xs text-gray-500'}>
              按时退休遗产
            </div>
          </div>
        </div>
        <div className={'grid grid-cols-4 text-right gap-x-2 gap-y-1 mt-2'}>
          <div className={'text-center border p-1 rounded'}>
            <div className={'text-base'}>
              {format(res.total.work)}
            </div>
            <div className={'text-xs text-gray-500'}>
              总工作收入
            </div>
          </div>
          <div className={'text-center border p-1 rounded'}>
            <div className={'text-base'}>
              {format(res.total.income)}
            </div>
            <div className={'text-xs text-gray-500'}>
              总其他收入
            </div>
          </div>
          <div className={'text-center border p-1 rounded'}>
            <div className={'text-base'}>
              {format(res.total.interest)}
            </div>
            <div className={'text-xs text-gray-500'}>
              总利息收入
            </div>
          </div>
          <div className={'text-center border p-1 rounded'}>
            <div className={'text-base'}>
              {format(res.total.expense)}
            </div>
            <div className={'text-xs text-gray-500'}>
              总花费
            </div>
          </div>
        </div>
      </div>

      <div className={'border shadow p-2'}>
        <div className={'text-lg text-center'}>
          收支
        </div>
        <table className={'w-full'}>
          <tbody>
          <tr>
            <td
              className={'font-semibold bg-blue-50'}
              colSpan={2}
            >
              收入
            </td>
          </tr>
          {input.fees.map((fee, index) => fee.type === 'work' ? (
            <tr key={fee.id}>
              <td className={'pl-4'}>{fee.name}</td>
              <td className={'text-right'}>{format(res.total.fees[index])}</td>
            </tr>
          ) : null)}
          {input.fees.map((fee, index) => fee.type === 'income' ? (
            <tr key={fee.id}>
              <td className={'pl-4'}>{fee.name}</td>
              <td className={'text-right'}>{format(res.total.fees[index])}</td>
            </tr>
          ) : null)}
          <tr>
            <td className={'pl-4'}>利息</td>
            <td className={'text-right'}>{format(res.total.interest)}</td>
          </tr>
          <tr>
            <td className={'pl-4 font-semibold'}>合计</td>
            <td className={'text-right'}>{format(res.total.income + res.total.work + res.total.interest)}</td>
          </tr>
          <tr>
            <td
              className={'font-semibold bg-violet-50'}
              colSpan={2}
            >
              支出
            </td>
          </tr>
          {input.fees.map((fee, index) => fee.type === 'expense' ? (
            <tr key={fee.id}>
              <td className={'pl-4'}>{fee.name}</td>
              <td className={'text-right'}>{format(res.total.fees[index])}</td>
            </tr>
          ) : null)}
          <tr>
            <td className={'pl-4 font-semibold'}>合计</td>
            <td className={'text-right'}>{format(res.total.expense)}</td>
          </tr>
          <tr className={'border-t'}>
            <td className={'pl-4 font-semibold'}>期初</td>
            <td className={'text-right'}>{format(input.balance)}</td>
          </tr>
          <tr className={'border-t'}>
            <td className={'pl-4 font-semibold'}>期末</td>
            <td className={'text-right'}>{format(res.endValue)}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div className={'border shadow p-2'}>
        <div className={'text-lg text-center'}>
          年度详情
        </div>
        <div className={'w-full text-right max-h-[60vh] overflow-auto sb-lite'}>
          <table className={'w-full'}>
            <thead>
            <tr>
              <th className={'sticky top-0 bg-white shadow'}>年龄</th>
              <th className={'sticky top-0 bg-white shadow'}>收入</th>
              <th className={'sticky top-0 bg-white shadow'}>支出</th>
              <th className={'sticky top-0 bg-white shadow'}>利息</th>
              <th className={'sticky top-0 bg-white shadow'}>期末</th>
              <th className={'sticky top-0 bg-white shadow pr-2'}>需要</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td/>
              <td/>
              <td/>
              <td/>
              <td>{input.balance}</td>
              <td/>
            </tr>
            {res.years.map((year) => (
              <tr key={year.age}>
                <td>{year.age}</td>
                <td>{format(year.work + year.income)}</td>
                <td>{format(year.expense)}</td>
                <td>{format(year.interest)}</td>
                <td>{format(year.endBalance)}</td>
                <td className={'pr-2'}>{format(year.nowNeed)}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};