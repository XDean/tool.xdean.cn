import { Fee, FeeType } from '../model/fee';
import { BanknoteArrowDown, BanknoteArrowUp, BriefcaseBusiness, LucideIcon } from 'lucide-react';

export const FeeTypeOptions: Record<FeeType, {
  border: string
  bg: string
  icon: LucideIcon
  default: Fee,
  presets: readonly Fee[]
}> = {
  work: {
    border: 'border-blue-500',
    bg: 'bg-blue-500',
    icon: BriefcaseBusiness,
    default: Fee.create({
      name: '',
      startValue: 1000,
      type: 'work',
    }),
    presets: [
      Fee.create({
        name: '工作',
        startValue: 5000,
        ageRange: [null, 60],
        valueRange: [null, 20000],
        type: 'work',
        yearIncreaseRatio: 0.03,
      }),
      Fee.create({name: '打两份工', startValue: 2000, ageRange: [null, 50], type: 'work'}),
      Fee.create({name: '网约车', startValue: 2000, ageRange: [null, 50], type: 'work'}),
      Fee.create({name: '夜市摆摊', startValue: 2000, ageRange: [null, 50], type: 'work'}),
      Fee.create({name: '别加了', startValue: 0, type: 'work'}),
    ],
  },
  income: {
    border: 'border-green-500',
    bg: 'bg-green-500',
    icon: BanknoteArrowUp,
    default: Fee.create({
      name: '',
      startValue: 1000,
      type: 'income',
    }),
    presets: [
      Fee.create({
        name: '养老金',
        startValue: 2000,
        ageRange: [61, null],
        valueRange: [null, 5000],
        type: 'income',
        yearIncrease: 100,
      }),
      Fee.create({name: '房租收入', startValue: 1000, type: 'income', yearIncrease: 0.01}),
      Fee.create({name: '投资分红', startValue: 1000, type: 'income', yearIncrease: 0.01}),
    ],
  },
  expense: {
    border: 'border-violet-500',
    bg: 'bg-violet-500',
    icon: BanknoteArrowDown,
    default: Fee.create({
      name: '',
      startValue: 1000,
      type: 'expense',
    }),
    presets: [
      Fee.create({name: '社保', startValue: 1000, ageRange: [null, 60], type: 'expense'}),
      Fee.create({name: '房租水电', startValue: 1500, type: 'expense'}),
      Fee.create({name: '吃吃喝喝', startValue: 1000, type: 'expense'}),
      Fee.create({name: '服装日用', startValue: 500, type: 'expense'}),
      Fee.create({name: '出行旅游', startValue: 400, type: 'expense'}),
      Fee.create({name: '医疗保健', startValue: 200, type: 'expense'}),
      Fee.create({name: '兴趣爱好', startValue: 200, type: 'expense'}),
      Fee.create({name: '子女抚养', startValue: 1000, ageRange: [30, 50], type: 'expense'}),
    ],
  },
};
