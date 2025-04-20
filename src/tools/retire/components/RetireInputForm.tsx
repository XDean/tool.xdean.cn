import { RetireInput } from '../model/retire';
import { FC } from 'react';
import { Fee } from '../model/fee';
import { FeeCard } from './FeeCard';
import { DraftFunction } from 'use-immer';
import { Button, NumberInput } from '@mantine/core';
import {
  BadgePercent,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BriefcaseBusiness,
  CalendarDays,
  PiggyBank,
  Skull,
  User,
} from 'lucide-react';
import produce from 'immer';
import { thousandFormatter, thousandParser } from '../../../util/mantine/input';

type Props = {
  value: RetireInput;
  onChange: (input: RetireInput) => void
};

export const RetireInputForm: FC<Props> = ({value, onChange}) => {
  const setValue = (fn: DraftFunction<RetireInput>) => {
    onChange(produce(value, fn));
  };
  return (
    <div className={'space-y-2'}>
      <div className={'flex items-center flex-wrap gap-x-4 gap-y-1'}>
        <div className={'flex items-center gap-1'}>
          <PiggyBank size={20}/>
          <div>当前存款</div>
          <NumberInput
            size={'xs'}
            value={value.balance}
            onChange={e => e !== undefined && setValue((v) => {
              v.balance = e;
            })}
            rightSection={'元'}
            className={'!w-28'}
            classNames={{rightSection: 'text-xs'}}
            parser={thousandParser}
            formatter={thousandFormatter}
          />
        </div>
        <div className={'flex items-center gap-1'}>
          <BadgePercent size={20}/>
          <div>年化利率</div>
          <NumberInput
            size={'xs'}
            value={value.interestRate * 100}
            onChange={e => e !== undefined && setValue((v) => {
              v.interestRate = e / 100;
            })}
            rightSection={'%'}
            className={'!w-28'}
            classNames={{rightSection: 'text-xs'}}
            min={0}
            max={100}
            precision={2}
            step={0.01}
          />
        </div>
        <div className={'flex items-center gap-1'}>
          <User size={20}/>
          <div>当前年龄</div>
          <NumberInput
            size={'xs'}
            value={value.nowAge}
            onChange={e => e !== undefined && setValue((v) => {
              v.nowAge = e;
            })}
            rightSection={'岁'}
            classNames={{rightSection: 'text-xs'}}
            className={'!w-28'}
            min={0}
            max={200}
          />
        </div>
        <div className={'flex items-center gap-1'}>
          <CalendarDays size={20}/>
          <div>退休年龄</div>
          <NumberInput
            size={'xs'}
            value={value.retireAge}
            onChange={e => e !== undefined && setValue((v) => {
              v.retireAge = e;
            })}
            rightSection={'岁'}
            className={'!w-28'}
            classNames={{rightSection: 'text-xs'}}
            min={0}
            max={200}
          />
        </div>
        <div className={'flex items-center gap-1'}>
          <Skull size={20}/>
          <div>结束年龄</div>
          <NumberInput
            size={'xs'}
            value={value.endAge}
            onChange={e => e !== undefined && setValue((v) => {
              v.endAge = e;
            })}
            rightSection={'岁'}
            className={'!w-28'}
            classNames={{rightSection: 'text-xs'}}
            min={0}
            max={200}
          />
        </div>
      </div>
      <div className={'flex items-center gap-1'}>
        <Button
          leftIcon={<BriefcaseBusiness size={16}/>}
          color={'blue'}
          size={'sm'}
          compact
          onClick={() => setValue(v => {
            v.fees.push(Fee.create({
              name: '',
              startValue: 5000,
              yearIncreaseRatio: 0.03,
              type: 'work',
            }));
          })}
        >
          添加工作
        </Button>
        <Button
          leftIcon={<BanknoteArrowUp size={16}/>}
          color={'green'}
          size={'sm'}
          compact
          onClick={() => setValue(v => {
            v.fees.push(Fee.create({
              name: '',
              startValue: 5000,
              yearIncreaseRatio: 0.03,
              type: 'income',
            }));
          })}
        >
          添加收入
        </Button>
        <Button
          leftIcon={<BanknoteArrowDown size={16}/>}
          color={'violet'}
          size={'sm'}
          compact
          onClick={() => setValue(v => {
            v.fees.push(Fee.create({
              name: '',
              startValue: 5000,
              yearIncreaseRatio: 0.03,
              type: 'expense',
            }));
          })}
        >
          添加支出
        </Button>
      </div>

      <div className="space-y-2">
        {[
          ...value.fees.filter(e => e.type === 'work'),
          ...value.fees.filter(e => e.type === 'income'),
          ...value.fees.filter(e => e.type === 'expense'),
        ]
          .map((fee) => (
            <FeeCard
              key={fee.id}
              value={fee}
              onChange={newFee => setValue(v => {
                const idx = v.fees.findIndex(e => e.id === fee.id);
                v.fees[idx] = newFee;
              })}
              onDelete={() => setValue(v => {
                const idx = v.fees.findIndex(e => e.id === fee.id);
                v.fees.splice(idx, 1);
              })}
            />
          ))}
      </div>
    </div>
  );
};