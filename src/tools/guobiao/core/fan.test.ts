import { expect, test } from '@jest/globals';
import {
  ALL_FANS,
  DanDiaoJiang,
  DaYuWu,
  DuanYao,
  Fan,
  Hua,
  LaoShaoFu,
  LvYiSe,
  MenFengKe,
  MenQianQing,
  PengPengHu,
  PingHu,
  QingYiSe,
  QuanFengKe,
  SanSeSanTongShun,
  ShiSanYao,
  ShuangAnKe,
  ShuangTongKe,
  SiAnKe, SiGuiYi,
  WuFanHu,
  WuMenQi,
  WuZi,
  XiXiangFeng,
  YaoJiuKe,
  YiBanGao,
  YiSeSanJieGao,
  ZiMo,
} from './fan';
import { Hand } from './type';
import { calcHuBest } from './hu';

describe('samples', () => {
  for (const f of ALL_FANS) {
    if (f.sample) {
      it(`${f.name}`, function () {
        f.sample!.forEach(s => {
          const hu = calcHuBest(s.hand);
          console.log(s.hand.toUnicode(), hu?.fans.map(e => e.name).join(','));
          expect(hu?.fans.map(e => e.name)).toContain(f.name);
        });
      });
    }
  }
});

const expectHu = (hand: Hand, fans: Fan[]) => {
  const hu = calcHuBest(hand);
  console.log(hand.toUnicode(), hu?.fans.map(e => e.name).join(','));
  expect(hu?.fans.map(e => e.name).sort()).toEqual(fans.map(e => e.name).sort());
};

describe('bugs', () => {

  // https://github.com/XDean/blog-comment/issues/5#issuecomment-820345670
  test('三色三同顺', () => {
    expectHu(Hand.create('ct7b7w7 lt789 66'),
      [DaYuWu, SanSeSanTongShun, PingHu, YiBanGao]);
  });

  // https://github.com/XDean/blog-comment/issues/5#issuecomment-914003099
  test('花牌无番胡', () => {
    expectHu(Hand.create('pb7 lt123 67 w789 z11 t5', {hua: 2}),
      [WuFanHu, Hua, Hua]);
  });

  // https://github.com/XDean/blog-comment/issues/5#issuecomment-917601166
  test('门风+圈风导致幺九刻少计', () => {
    expectHu(Hand.create('b111999w111z111t55', {menfeng: 1, quanfeng: 1}),
      [SiAnKe, ShuangTongKe, QuanFengKe, MenFengKe, YaoJiuKe, YaoJiuKe, YaoJiuKe, DanDiaoJiang]);
  });

  // https://github.com/XDean/blog-comment/issues/5#issuecomment-926930315
  test('字牌计同刻', () => {
    expectHu(Hand.create('pw3z3t1 lz66b333'),
      [ShuangTongKe, YaoJiuKe, YaoJiuKe, WuMenQi, PengPengHu]);
  });

  test('三色三同顺2', () => {
    expectHu(Hand.create('t345345b234w345z66'),
      [YiBanGao, DanDiaoJiang, XiXiangFeng, MenQianQing]);
  });

  test('2老少副2喜相逢', () => {
    expectHu(Hand.create('t123789w123789b66'),
      [DanDiaoJiang, XiXiangFeng, PingHu, LaoShaoFu, LaoShaoFu, MenQianQing]);
  });

  test('十三幺不求人', () => {
    expectHu(Hand.create('t19w19b19z12345671', {zimo: true}),
      [ShiSanYao, ZiMo]);
  });

  test('绿一色混一色', () => {
    expectHu(Hand.create('pt8 lt66 234 234 342'),
      [LvYiSe, YiSeSanJieGao, PengPengHu, ShuangAnKe, QingYiSe, DuanYao]);
  });

  test('坎张不计1', () => {
    expectHu(Hand.create('pt8 lt123 34 b234 w66 t2'),
      [XiXiangFeng, WuZi]);
  });

  test('坎张不计2', () => {
    expectHu(Hand.create('t222 b234 pt8 lw55 t132'),
      [SiGuiYi, WuZi]);
  });

});