import { FeeType } from '../model/fee';
import { BanknoteArrowDown, BanknoteArrowUp, BriefcaseBusiness, LucideIcon } from 'lucide-react';

export const FeeTypeOptions: Record<FeeType, {
  border: string
  bg: string
  icon: LucideIcon
}> = {
  work: {
    border: 'border-blue-500',
    bg: 'bg-blue-500',
    icon: BriefcaseBusiness,
  },
  income: {
    border: 'border-green-500',
    bg: 'bg-green-500',
    icon: BanknoteArrowUp,
  },
  expense: {
    border: 'border-violet-500',
    bg: 'bg-violet-500',
    icon: BanknoteArrowDown,
  },
} as const;