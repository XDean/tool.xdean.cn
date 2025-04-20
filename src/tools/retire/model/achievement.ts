import { StaticImageData } from 'next/dist/client/image';
import tsqb from '../images/achievement/弹射起步.webp';
import bsgm from '../images/achievement/不是哥们.webp';
import rhqm from '../images/achievement/人活钱没.webp';
import bpzj from '../images/achievement/爆破专家.webp';
import fzfz from '../images/achievement/犯罪分子.webp';
import smwj from '../images/achievement/生命无价.webp';
import gsft from '../images/achievement/股神附体.webp';
import pxzs from '../images/achievement/貔貅在世.webp';
import jdhk from '../images/achievement/静待花开.webp';
import fzcn from '../images/achievement/风烛残年.webp';
import { RetireInput, RetireRes } from './retire';

export type Achievement = {
  id: string
  name: string
  desc: string
  icon: StaticImageData
  match: (input: RetireInput, res: RetireRes) => boolean
}

export const BPZJ: Achievement = {
  id: 'bpzj',
  name: '爆破专家',
  desc: '被玩坏了，请温柔点',
  icon: bpzj,
  match: () => false,
};

export const Achievements: Achievement[] = [
  {
    id: 'tsqb',
    name: '弹射起步',
    desc: '你已经自由了，走吧，不要再来了',
    icon: tsqb,
    match: (input, res) => res.minRetireAge <= input.nowAge,
  },
  {
    id: 'bsgm',
    name: '不是哥们',
    desc: '众所周知，退休的前提是有工作',
    icon: bsgm,
    match: (input, _res) => input.fees.every(fee => fee.type !== 'work'),
  },
  {
    id: 'rhqm',
    name: '人活钱没',
    desc: 'XX贷款，XX金融，X呗，主打一个来者不拒',
    icon: rhqm,
    match: (_input, res) => res.years.some(e => e.endBalance < 0),
  },
  {
    id: 'gsft',
    name: '股神附体',
    desc: '第一步成为巴菲特，第二步竞选美国总统',
    icon: gsft,
    match: (input) => input.interestRate >= 0.1 && input.interestRate < 0.5,
  },
  {
    id: 'fzfz',
    name: '犯罪分子',
    desc: '牢朋友，在哪里发财，刑法第几条',
    icon: fzfz,
    match: (input) => input.interestRate >= 0.5,
  },
  {
    id: 'smwj',
    name: '生命无价',
    desc: '世界在你眼里，活下去，莫放弃',
    icon: smwj,
    match: (input) => input.endAge < 60,
  },
  {
    id: 'pxzs',
    name: '貔貅在世',
    desc: '挣得多花得少，活该你能退休早',
    icon: pxzs,
    match: (_input, res) => res.total.work > res.total.expense * 3,
  },
  {
    id: 'jdhk',
    name: '静待花开',
    desc: '平平安安过一生，提前退休就别想了',
    icon: jdhk,
    match: (_input, res) => res.minRetireAge === -1,
  },
  {
    id: 'fzcn',
    name: '风烛残年',
    desc: '还能说什么呢，趁年轻，多攒点吧',
    icon: fzcn,
    match: (input, res) => (res.years.find(e => e.endBalance < 0)?.age ?? 0) > input.retireAge,
  },
];

export function calcAchievement(input: RetireInput, res: RetireRes): Achievement[] {
  return Achievements.filter(e => e.match(input, res));
}