import { FC } from 'react';
import { Fee } from '../model/fee';
import { BiTrash } from 'react-icons/bi';
import clsx from 'clsx';
import { ActionIcon, NumberInput, TextInput } from '@mantine/core';
import { Banknote, CalendarRange, MessageSquare, Ruler, TrendingUp } from 'lucide-react';
import produce from 'immer';
import { DraftFunction } from 'use-immer/dist';
import { thousandFormatter, thousandParser } from '../../../util/mantine/input';
import { FeeTypeOptions } from '../util/constants';

type Props = {
  value: Fee;
  onChange: (fee: Fee) => void;
  onDelete: () => void;
};

export const FeeCard: FC<Props> = ({value, onChange, onDelete}) => {
  const setValue = (fn: DraftFunction<Fee>) => {
    onChange(produce(value, fn));
  };
  const feeType = FeeTypeOptions[value.type];
  return (
    <div className={clsx(
      `relative p-2 rounded space-y-2 border`, feeType.border)}>
      <div className={'flex items-center gap-1'}>
        <div className={clsx(
          'flex items-center gap-1 text-white rounded text-xs p-1',
          feeType.bg,
        )}>
          <feeType.icon size={16}/>
        </div>
        <TextInput
          value={value.name}
          onChange={e => e !== undefined && setValue((v) => {
            v.name = e.target.value;
          })}
          placeholder={'输入类目名字'}
          className={'!w-36 border-b'}
          classNames={{input: 'w-full'}}
          variant={'headless'}
        />
        <div className={'flex-grow'}/>
        <ActionIcon
          onClick={onDelete}
          color={'red'}
        >
          <BiTrash/>
        </ActionIcon>
      </div>
      <div className={'flex items-center flex-wrap gap-x-4 gap-y-1'}>
        <div className={'flex items-center gap-1'}>
          <Banknote size={16}/>
          <div>金额</div>
          <NumberInput
            size={'xs'}
            value={value.startValue}
            onChange={e => e !== undefined && setValue((v) => {
              v.startValue = e;
            })}
            rightSection={'元/月'}
            className={'!w-24'}
            parser={thousandParser}
            formatter={thousandFormatter}
            classNames={{
              input: '!pr-9',
              rightSection: '!w-8 text-xs',
            }}
          />
        </div>
        <div className={'flex items-center gap-1'}>
          <TrendingUp size={16}/>
          <div>涨幅</div>
          <NumberInput
            size={'xs'}
            value={value.yearIncreaseRatio * 100}
            onChange={e => e !== undefined && setValue((v) => {
              v.yearIncreaseRatio = e / 100;
            })}
            rightSection={'%'}
            className={'!w-16'}
            classNames={{rightSection: 'text-xs'}}
            precision={2}
          />
          <div>
            +
          </div>
          <NumberInput
            size={'xs'}
            value={value.yearIncrease}
            onChange={e => e !== undefined && setValue((v) => {
              v.yearIncrease = e;
            })}
            rightSection={'元'}
            className={'!w-20'}
            classNames={{rightSection: 'text-xs'}}
            parser={thousandParser}
            formatter={thousandFormatter}
          />
        </div>
        <div className={'flex items-center gap-1'}>
          <CalendarRange size={16}/>
          <div>年龄</div>
          <NumberInput
            size={'xs'}
            value={value.ageRange[0] ?? undefined}
            onChange={e => setValue((v) => {
              v.ageRange[0] = e ?? null;
            })}
            placeholder={'起始'}
            hideControls
            className={'!w-16'}
            min={0}
            max={200}
          />
          <div>
            ~
          </div>
          <NumberInput
            size={'xs'}
            value={value.ageRange[1] ?? undefined}
            onChange={e => setValue((v) => {
              v.ageRange[1] = e ?? null;
            })}
            placeholder={'结束'}
            hideControls
            className={'!w-16'}
          />
        </div>
        <div className={'flex items-center gap-1'}>
          <Ruler size={16}/>
          <div>范围</div>
          <NumberInput
            size={'xs'}
            value={value.valueRange[0] ?? undefined}
            onChange={e => setValue((v) => {
              v.valueRange[0] = e ?? null;
            })}
            placeholder={'最小'}
            rightSection={'元'}
            className={'!w-24'}
            classNames={{rightSection: 'text-xs'}}
            min={0}
            max={200}
            parser={thousandParser}
            formatter={thousandFormatter}
          />
          <div>
            ~
          </div>
          <NumberInput
            size={'xs'}
            value={value.valueRange[1] ?? undefined}
            onChange={e => setValue((v) => {
              v.valueRange[1] = e ?? null;
            })}
            placeholder={'最大'}
            rightSection={'元'}
            className={'!w-24'}
            classNames={{rightSection: 'text-xs'}}
            parser={thousandParser}
            formatter={thousandFormatter}
          />
        </div>
        <div className={'flex items-center gap-1'}>
          <MessageSquare size={16}/>
          <div>备注</div>
          <TextInput
            size={'xs'}
            value={value.comment}
            onChange={e => setValue((v) => {
              v.comment = e.target.value;
            })}
          />
        </div>
      </div>
    </div>
  );
};