import { FeeType } from '../model/fee';
import { BanknoteArrowDown, BanknoteArrowUp, BriefcaseBusiness, LucideIcon } from 'lucide-react';

export const FeeTypeOptions: Record<FeeType, {
  border: string
  bg: string
  icon: LucideIcon
  names: readonly string[]
}> = {
  work: {
    border: 'border-blue-500',
    bg: 'bg-blue-500',
    icon: BriefcaseBusiness,
    names: ['工作', '打两份工', '网约车', '夜市摆摊', '别加了'],
  },
  income: {
    border: 'border-green-500',
    bg: 'bg-green-500',
    icon: BanknoteArrowUp,
    names: ['养老金', '房租收入', '投资分红'],
  },
  expense: {
    border: 'border-violet-500',
    bg: 'bg-violet-500',
    icon: BanknoteArrowDown,
    names: ['社保', '房租水电', '吃吃喝喝', '服装日用', '出行旅游', '医疗保健', '兴趣爱好', '子女抚养'],
  },
} as const;
