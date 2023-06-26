import {expect, test} from '@jest/globals';
import {
  ALL_FANS, BianZhang,
  BuQiuRen,
  DanDiaoJiang,
  DaYuWu,
  DuanYao,
  Fan,
  GangShangKaiHua,
  HaiDiLaoYue,
  Hua,
  HuaLong,
  HuJueZhang,
  LaoShaoFu,
  LianLiu,
  LvYiSe,
  MenFengKe,
  MenQianQing,
  MiaoShouHuiChun,
  MingAnGang,
  MingGang,
  PengPengHu,
  PingHu,
  QiangGangHu,
  QiDuiFan,
  QingLong,
  QingYaoJiu,
  QingYiSe,
  QuanDaiWu,
  QuanDaiYao,
  QuanFengKe,
  QuanQiuRen,
  QueYiMen,
  SanSeSanBuGao,
  SanSeSanJieGao,
  SanSeSanTongShun,
  ShiSanYao,
  ShuangAnKe,
  ShuangTongKe,
  SiAnKe,
  SiGang,
  SiGuiYi,
  WuFanHu,
  WuMenQi,
  WuZi,
  XiXiangFeng,
  YaoJiuKe,
  YiBanGao,
  YiSeSanJieGao,
  YiSeSanTongShun,
  YiSeSiBuGao,
  ZiMo,
} from './fan';
import {calcHuBest} from './hu';
import {Hand} from './type';

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

describe('rules', () => {
  describe('不拆移原则', () => {
    test('1', () => {
      expectHu(Hand.create('ct1234 lw77'),
        [YiSeSiBuGao, QuanQiuRen, PingHu, QueYiMen]);
    });

    test('2', () => {
      expectHu(Hand.create('b123345567789w77'),
        [YiSeSiBuGao, DanDiaoJiang, PingHu, QueYiMen, MenQianQing]);
    });
  });

  describe('不得相同原则', () => {
    test('1', () => {
      expectHu(Hand.create('cw1471 lt11'),
        [QingLong, QuanQiuRen, PingHu, YiBanGao, QueYiMen]);
    });
    test('2', () => {
      expectHu(Hand.create('cw1474 lt11'),
        [QingLong, QuanQiuRen, PingHu, YiBanGao, QueYiMen]);
    });
    test('3', () => {
      expectHu(Hand.create('pb2t3w4b5 lz11'),
        [SanSeSanJieGao, PengPengHu, QuanQiuRen]);
    });
    test('4', () => {
      expectHu(Hand.create('cw5b4t36 lz11'),
        [SanSeSanBuGao, QuanQiuRen, LianLiu]);
    });
    test('5', () => {
      expectHu(Hand.create('ct33b3 lw77888'),
        [DuanYao, YiBanGao, XiXiangFeng]);
    });
  });

  describe('就高不就低原则', () => {
    test('1', () => {
      expectHu(Hand.create('b555666777t55567', {zimo: true}),
        [YiSeSanTongShun, QuanDaiWu, BuQiuRen, PingHu, XiXiangFeng, QueYiMen]);
    });
  });

  describe('套算一次原则', () => {
    test('1', () => {
      expectHu(Hand.create('cw14b7t1 lz11'),
        [HuaLong, QuanQiuRen, XiXiangFeng]);
    });
    test('2', () => {
      expectHu(Hand.create('cw17t17 lz11'),
        [QuanQiuRen, QuanDaiYao, XiXiangFeng, XiXiangFeng, LaoShaoFu, QueYiMen]);
    });
  });

  describe('不求人', () => {
    test('1', () => {
      expectHu(Hand.create('b11223344556688', {zimo: true}),
        [QiDuiFan, QingYiSe, BuQiuRen]);
    });
  });
});

describe('special', () => {
  test('和绝张', () => {
    expectHu(Hand.create('pt2 lz11 b123456789', {juezhang: true}),
      [QingLong, QueYiMen, HuJueZhang]);
  });
  test('和不存在的绝张', () => {
    expectHu(Hand.create('pt2 lb123456789 z11', {juezhang: true}),
      [QingLong, DanDiaoJiang, QueYiMen]);
  });
  test('和不存在的抢杠和', () => {
    expectHu(Hand.create('pt2 lb123456789 z11', {gangShang: true}),
      [QingLong, DanDiaoJiang, QueYiMen]);
  });
  test('和不存在的杠上开', () => {
    expectHu(Hand.create('pt2 lb123456789 z11', {gangShang: true, zimo: true}),
      [QingLong, DanDiaoJiang, QueYiMen, ZiMo]);
  });
  test('抢杠和', () => {
    expectHu(Hand.create('pt2 lz11 b123456789', {gangShang: true}),
      [QingLong, QueYiMen, QiangGangHu]);
  });
  test('杠上开花', () => {
    expectHu(Hand.create('gt2 lz11 b123456789', {gangShang: true, zimo: true}),
      [QingLong, QueYiMen, GangShangKaiHua, MingGang]);
  });
  test('妙手回春', () => {
    expectHu(Hand.create('gt2 lz11 b123456789', {lastTile: true, zimo: true}),
      [QingLong, QueYiMen, MingGang, MiaoShouHuiChun]);
  });
  test('海底捞月', () => {
    expectHu(Hand.create('gt2 lz11 b123456789', {lastTile: true}),
      [QingLong, QueYiMen, MingGang, HaiDiLaoYue]);
  });
  test('杠上开花-妙手回春', () => {
    expectHu(Hand.create('gt2 lz11 b123456789', {gangShang: true, lastTile: true, zimo: true}),
      [QingLong, QueYiMen, MingGang, MiaoShouHuiChun, GangShangKaiHua]);
  });
  test('抢杠和-海底捞月', () => {
    expectHu(Hand.create('gt2 lz11 b123456789', {gangShang: true, lastTile: true}),
      [QingLong, QueYiMen, MingGang, HaiDiLaoYue, QiangGangHu]);
  });
});

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
      [DanDiaoJiang, XiXiangFeng, PingHu, XiXiangFeng, LaoShaoFu, MenQianQing]);
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

  //https://github.com/XDean/blog-comment/issues/5#issuecomment-1426996592
  test('字牌不算全双刻', () => {
    expectHu(Hand.create('gt2 at4 lt66688z66 t8'),
      [LvYiSe, MingAnGang, PengPengHu, ShuangAnKe]);
  });

  // https://github.com/XDean/blog-comment/issues/5#issuecomment-1376120115
  test('双连六喜相逢', () => {
    expectHu(Hand.create('t234567 b23456 w33 b7'),
      [MenQianQing, PingHu, DuanYao, XiXiangFeng, XiXiangFeng, LianLiu]);
  });

  // https://github.com/XDean/blog-comment/issues/5#issuecomment-1588690291
  test('清幺九不计双同刻', () => {
    expectHu(Hand.create('aw19t19lb11@'),
      [QingYaoJiu, SiAnKe, SiGang]);
  });

  // https://github.com/XDean/blog-comment/issues/5#issuecomment-1606510446
  test('漏记边张', () => {
    expectHu(Hand.create('t123567w34589z55w7@'),
      [MenQianQing, QueYiMen, BianZhang]);
  });
});