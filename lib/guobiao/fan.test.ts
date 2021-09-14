import {expect, test} from "@jest/globals";
import {
  AnGang,
  BianZhang,
  BuQiuRen,
  calcFan,
  DanDiaoJiang,
  DaSanYuan,
  DaSiXi,
  DaYuWu,
  DuanYao,
  GangShangKaiHua,
  HaiDiLaoYue,
  Hua,
  HuaLong,
  HuJueZhang,
  HunYaoJiu,
  HunYiSe,
  JianKe,
  JiuLianBaoDeng,
  KanZhang,
  LaoShaoFu,
  LianQiDui,
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
  QiXingBuKao,
  QuanBuKao,
  QuanDa,
  QuanDaiWu,
  QuanDaiYao,
  QuanFengKe,
  QuanQiuRen,
  QuanShuangKe,
  QuanXiao,
  QuanZhong,
  QueYiMen,
  SanAnKe,
  SanFengKe,
  SanGang,
  SanSeSanBuGao,
  SanSeSanJieGao,
  SanSeSanTongShun,
  SanSesHuangLongHui,
  SanTongKe,
  ShiSanYao,
  ShuangAnGang,
  ShuangAnKe,
  ShuangJianKe,
  ShuangMingGang,
  ShuangTongKe,
  SiAnKe,
  SiGang,
  SiGuiYi,
  TuiBuDao,
  WuFanHu,
  WuMenQi,
  WuZi,
  XiaoSanYuan,
  XiaoSiXi,
  XiaoYuWu,
  YaoJiuKe,
  YiBanGao,
  YiSeSanBuGao,
  YiSeSanJieGao,
  YiSeSanTongShun,
  YiSeShuangLong,
  YiSeSiBuGao,
  YiSeSiJieGao,
  YiSeSiTongShun,
  ZiMo,
  ZiYiSe,
  ZuHeLongFan
} from "./fan";
import {
  BuKao,
  Chi,
  Combination,
  Dui,
  Fan,
  Gang,
  Hand,
  Ke,
  Mian,
  Options,
  Peng,
  QiDui,
  Shun,
  Tiles,
  Yao13,
  ZuHeLong,
} from "./type";
import {Tile} from "./tile";


function expectFan(
  {
    mians,
    last,
    options,
    fans,
    name
  }: {
    mians: Mian[],
    last: Tile,
    options?: Partial<Options>,
    fans: Fan[],
    name?: string
  }) {
  const log = console.log
  test(name || fans[0].name, () => {
    const shuns = mians.filter(m => m.type === 'shun' && m.open).map(m => new Chi((m as Shun).tile))
    const pengs = mians.filter(m => m.type === 'ke' && m.open).map(m => new Peng((m as Ke).tile))
    const gangs = mians.filter(m => m.type === 'ke' && m.gang).map(m => new Gang((m as Ke).tile, m.open))
    const others = mians.filter(m => !m.open && !(m.type === 'ke' && m.gang))
      .flatMap(m => m.toTiles.tiles)

    const hand = new Hand(new Tiles([...others, last]).split(last)[0], [...shuns, ...pengs, ...gangs], options);
    const comb = new Combination(mians);
    log(name || fans[0].name, comb.toTiles.unicode)
    const calcFans = calcFan(hand, comb)
    expect(calcFans.map(f => f.name).sort()).toEqual(fans.map(f => f.name).sort())
  })
}

expectFan({
  mians: [
    ...Tile.F.map(t => new Ke(t, false, true)),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.Y[0],
  options: {zimo: true},
  fans: [DaSiXi, SiAnKe, SiGang, ZiYiSe, BuQiuRen]
})

expectFan({
  mians: [
    ...Tile.Y.map(t => new Ke(t)),
    new Shun(Tile.T[0]),
    new Dui(Tile.T[1]),
  ],
  last: Tile.T[2],
  options: {zimo: true},
  fans: [DaSanYuan, SanAnKe, HunYiSe, BianZhang, BuQiuRen]
})

expectFan({
  mians: [
    new Shun(Tile.T[1]),
    new Shun(Tile.T[1]),
    new Ke(Tile.T[7], true, true),
    new Ke(Tile.Ys.fa),
    new Dui(Tile.T[5]),
  ],
  last: Tile.T[1],
  options: {hua: 3, gangShang: true},
  fans: [LvYiSe, YiBanGao, MingGang, HunYiSe, JianKe, Hua, Hua, Hua]
})

expectFan({
  mians: [
    new Ke(Tile.T[0]),
    new Shun(Tile.T[1]),
    new Shun(Tile.T[5]),
    new Ke(Tile.T[8]),
    new Dui(Tile.T[4]),
  ],
  last: Tile.T[4],
  options: {zimo: true},
  fans: [JiuLianBaoDeng, ShuangAnKe, YaoJiuKe, BuQiuRen]
})

expectFan({
  mians: [
    new Ke(Tile.T[0]),
    new Shun(Tile.T[0]),
    new Shun(Tile.T[3]),
    new Shun(Tile.T[6]),
    new Dui(Tile.T[8]),
  ],
  last: Tile.T[0],
  fans: [JiuLianBaoDeng, QingLong, SiGuiYi]
})

expectFan({
  name: '九莲宝灯 - 不成',
  mians: [
    new Ke(Tile.T[0]),
    new Shun(Tile.T[1], true),
    new Shun(Tile.T[5]),
    new Ke(Tile.T[8], true),
    new Dui(Tile.T[4]),
  ],
  last: Tile.T[0],
  fans: [QingYiSe, YaoJiuKe, YaoJiuKe]
})

expectFan({
  mians: [
    new Ke(Tile.T[1], false, true),
    new Ke(Tile.W[2], true, true),
    new Ke(Tile.B[5], true, true),
    new Ke(Tile.B[8], false, true),
    new Dui(Tile.B[7]),
  ],
  last: Tile.B[6],
  fans: [SiGang, YaoJiuKe, WuZi, ShuangAnGang]
})

expectFan({
  mians: [
    new QiDui(Tiles.of({'t': [2, 3, 4, 5, 6, 7, 8]}))
  ],
  last: Tile.T[1],
  fans: [LianQiDui, DuanYao]
})

expectFan({
  mians: [
    new Yao13(Tile.T[0])
  ],
  last: Tile.T[0],
  fans: [ShiSanYao]
})

expectFan({
  mians: [
    new Ke(Tile.T[0]),
    new Ke(Tile.B[0]),
    new Ke(Tile.W[8], true),
    new Ke(Tile.T[8], true),
    new Dui(Tile.B[8])
  ],
  last: Tile.T[0],
  fans: [QingYaoJiu, ShuangTongKe]
})

expectFan({
  mians: [
    ...Tile.F.slice(0, 3).map(t => new Ke(t)),
    new Shun(Tile.B[1]),
    new Dui(Tile.F[3]),
  ],
  last: Tile.B[1],
  options: {menfeng: 1, quanfeng: 2},
  fans: [XiaoSiXi, HunYiSe, MenFengKe, QuanFengKe, SanAnKe, MenQianQing]
})

expectFan({
  mians: [
    new Ke(Tile.Y[0]),
    new Ke(Tile.Y[1]),
    new Shun(Tile.T[0], true),
    new Shun(Tile.T[1]),
    new Dui(Tile.Y[2]),
  ],
  last: Tile.T[2],
  fans: [XiaoSanYuan, HunYiSe, KanZhang, ShuangAnKe]
})

expectFan({
  mians: [
    new Ke(Tile.Y[0], true),
    new Ke(Tile.Y[1], true),
    new Ke(Tile.F[0], true),
    new Ke(Tile.F[1]),
    new Dui(Tile.F[2]),
  ],
  last: Tile.F[2],
  options: {quanfeng: 3, menfeng: 2},
  fans: [ZiYiSe, ShuangJianKe, DanDiaoJiang, MenFengKe]
})

expectFan({
  name: '字七对',
  mians: [
    new QiDui(new Tiles(Tile.Z)),
  ],
  last: Tile.F[2],
  fans: [ZiYiSe, QiDuiFan]
})

expectFan({
  mians: [
    new Ke(Tile.T[0]),
    new Ke(Tile.T[1]),
    new Ke(Tile.T[3]),
    new Ke(Tile.T[4]),
    new Dui(Tile.B[0]),
  ],
  last: Tile.T[0],
  options: {zimo: true},
  fans: [SiAnKe, YaoJiuKe, WuZi, QueYiMen, BuQiuRen]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Shun(Tile.T[0]),
    new Shun(Tile.T[6]),
    new Shun(Tile.T[6]),
    new Dui(Tile.T[4]),
  ],
  last: Tile.T[0],
  fans: [YiSeShuangLong]
})

expectFan({
  mians: [
    new Shun(Tile.T[0]),
    new Shun(Tile.T[0]),
    new Shun(Tile.T[6]),
    new Shun(Tile.T[6]),
    new Dui(Tile.T[4]),
  ],
  last: Tile.T[0],
  fans: [YiSeShuangLong, MenQianQing]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Shun(Tile.T[0], true),
    new Shun(Tile.T[0], true),
    new Shun(Tile.T[0]),
    new Dui(Tile.B[4]),
  ],
  last: Tile.T[0],
  fans: [YiSeSiTongShun, HuJueZhang, PingHu, QueYiMen]
})

expectFan({
  mians: [
    new Ke(Tile.T[0], true),
    new Ke(Tile.T[1], true),
    new Ke(Tile.T[2], true),
    new Ke(Tile.T[3]),
    new Dui(Tile.B[4]),
  ],
  last: Tile.B[4],
  fans: [YiSeSiJieGao, YaoJiuKe, WuZi, QueYiMen, DanDiaoJiang]
})

expectFan({
  mians: [
    new Shun(Tile.T[1], true),
    new Shun(Tile.T[2], true),
    new Shun(Tile.T[3], true),
    new Shun(Tile.T[4]),
    new Dui(Tile.T[5]),
  ],
  last: Tile.T[5],
  fans: [YiSeSiBuGao, QingYiSe, PingHu, KanZhang, DuanYao, SiGuiYi]
})

expectFan({
  name: '一色四步高-2',
  mians: [
    new Shun(Tile.T[0], true),
    new Shun(Tile.T[2], true),
    new Shun(Tile.T[4], true),
    new Shun(Tile.T[6], true),
    new Dui(Tile.W[8]),
  ],
  last: Tile.W[8],
  fans: [YiSeSiBuGao, QuanQiuRen, PingHu, QueYiMen]
})

expectFan({
  mians: [
    new Ke(Tile.T[1], false, true),
    new Ke(Tile.W[2], true, true),
    new Ke(Tile.B[5], true, true),
    new Ke(Tile.B[7]),
    new Dui(Tile.B[6]),
  ],
  last: Tile.B[7],
  options: {zimo: true},
  fans: [SanGang, AnGang, PengPengHu, DuanYao, ShuangAnKe, ZiMo]
})

expectFan({
  mians: [
    new Ke(Tile.T[0], true, true),
    new Ke(Tile.W[8]),
    new Ke(Tile.F[1]),
    new Ke(Tile.Y[1]),
    new Dui(Tile.Y[2]),
  ],
  last: Tile.Y[2],
  fans: [HunYaoJiu, SanAnKe, JianKe, MingGang, QueYiMen, DanDiaoJiang]
})

expectFan({
  name: '幺九七对',
  mians: [
    new QiDui(new Tiles([Tile.T[0], Tile.T[8], Tile.W[0], Tile.W[8], Tile.B[0], Tile.B[8], Tile.F[3]]))
  ],
  last: Tile.T[0],
  fans: [HunYaoJiu, QiDuiFan]
})

expectFan({
  mians: [
    new QiDui(new Tiles([Tile.T[0], Tile.T[8], Tile.W[0], Tile.W[8], Tile.B[1], Tile.B[8], Tile.F[3]]))
  ],
  last: Tile.T[0],
  options: {zimo: true},
  fans: [QiDuiFan, BuQiuRen]
})

expectFan({
  mians: [
    new BuKao(Tiles.of({t: [1, 4, 7], b: [2], w: [3, 6, 9], z: [1, 2, 3, 4, 5, 6, 7]}))
  ],
  last: Tile.T[0],
  options: {zimo: true},
  fans: [QiXingBuKao, BuQiuRen]
})

expectFan({
  mians: [
    new Ke(Tile.T[3], true),
    new Ke(Tile.T[5], true),
    new Ke(Tile.B[7], true),
    new Ke(Tile.W[1]),
    new Dui(Tile.W[3])
  ],
  last: Tile.W[3],
  fans: [QuanShuangKe, DanDiaoJiang]
})

expectFan({
  mians: [
    new Shun(Tile.T[3], true),
    new Shun(Tile.T[5], true),
    new Ke(Tile.T[7], true),
    new Ke(Tile.T[1]),
    new Dui(Tile.T[3])
  ],
  last: Tile.T[1],
  fans: [QingYiSe, DuanYao, SiGuiYi]
})

expectFan({
  name: '清七对',
  mians: [
    new QiDui(Tiles.of({'t': [1, 2, 3, 4, 5, 6, 8]}))
  ],
  last: Tile.T[1],
  fans: [QingYiSe, QiDuiFan]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Shun(Tile.T[0], true),
    new Shun(Tile.T[0], true),
    new Shun(Tile.T[6]),
    new Dui(Tile.B[4]),
  ],
  last: Tile.T[6],
  fans: [YiSeSanTongShun, PingHu, QueYiMen, LaoShaoFu, LaoShaoFu, BianZhang]
})

expectFan({
  mians: [
    new Ke(Tile.T[0], true),
    new Ke(Tile.T[1], true),
    new Ke(Tile.T[2], true),
    new Ke(Tile.T[4]),
    new Dui(Tile.B[4]),
  ],
  last: Tile.B[4],
  fans: [YiSeSanJieGao, YaoJiuKe, WuZi, QueYiMen, DanDiaoJiang, PengPengHu]
})

expectFan({
  mians: [
    new Ke(Tile.T[6], true),
    new Ke(Tile.T[7], true),
    new Ke(Tile.B[7], true),
    new Ke(Tile.W[6]),
    new Dui(Tile.B[6]),
  ],
  last: Tile.W[6],
  fans: [QuanDa, PengPengHu, DuanYao, ShuangTongKe, ShuangTongKe]
})

expectFan({
  mians: [
    new Ke(Tile.T[3], true),
    new Ke(Tile.T[4], true),
    new Ke(Tile.B[5], true),
    new Shun(Tile.W[3]),
    new Dui(Tile.B[4]),
  ],
  last: Tile.B[4],
  fans: [QuanZhong, DanDiaoJiang]
})

expectFan({
  mians: [
    new Ke(Tile.T[0], true),
    new Ke(Tile.T[1], true),
    new Ke(Tile.B[2], true),
    new Shun(Tile.W[0]),
    new Dui(Tile.B[1]),
  ],
  last: Tile.B[1],
  fans: [QuanXiao, DanDiaoJiang, YaoJiuKe]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Shun(Tile.T[3], true),
    new Shun(Tile.T[6]),
    new Ke(Tile.B[2], true),
    new Dui(Tile.B[1]),
  ],
  last: Tile.B[1],
  fans: [QingLong, DanDiaoJiang, WuZi, QueYiMen]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Shun(Tile.B[0]),
    new Shun(Tile.T[6]),
    new Shun(Tile.B[6]),
    new Dui(Tile.W[4]),
  ],
  last: Tile.B[0],
  fans: [SanSesHuangLongHui]
})

expectFan({
  mians: [
    new Shun(Tile.T[1], true),
    new Shun(Tile.T[2], true),
    new Shun(Tile.T[3], true),
    new Ke(Tile.B[4]),
    new Dui(Tile.W[5]),
  ],
  last: Tile.W[5],
  fans: [YiSeSanBuGao, DuanYao, DanDiaoJiang]
})

expectFan({
  mians: [
    new Shun(Tile.T[3], true),
    new Shun(Tile.B[2], true),
    new Shun(Tile.B[4], true),
    new Ke(Tile.T[4]),
    new Dui(Tile.B[4]),
  ],
  last: Tile.B[4],
  fans: [QuanDaiWu, SiGuiYi, SiGuiYi, DanDiaoJiang, QueYiMen]
})

expectFan({
  mians: [
    new Ke(Tile.T[2], true),
    new Ke(Tile.B[2], true),
    new Ke(Tile.W[2], true),
    new Shun(Tile.T[4]),
    new Dui(Tile.B[4]),
  ],
  last: Tile.T[4],
  fans: [SanTongKe, DuanYao]
})

expectFan({
  mians: [
    new Ke(Tile.T[2]),
    new Ke(Tile.B[4]),
    new Ke(Tile.W[6]),
    new Shun(Tile.T[4]),
    new Dui(Tile.B[4]),
  ],
  last: Tile.T[4],
  fans: [SanAnKe, DuanYao, MenQianQing]
})

expectFan({
  mians: [
    new BuKao(Tiles.of({t: [1, 4, 7], b: [2, 5, 8], w: [3, 6, 9], z: [1, 2, 5, 6, 7]}))
  ],
  last: Tile.T[0],
  fans: [QuanBuKao, ZuHeLongFan]
})

expectFan({
  mians: [
    new ZuHeLong(Tiles.of({t: [1, 4, 7], b: [2, 5, 8], w: [3, 6, 9]})),
    new Shun(Tile.B[1]),
    new Dui(Tile.T[1])
  ],
  last: Tile.T[1],
  fans: [ZuHeLongFan, DanDiaoJiang, PingHu, MenQianQing]
})

expectFan({
  mians: [
    new Ke(Tile.T[5], true),
    new Ke(Tile.T[7], true),
    new Ke(Tile.B[6], true),
    new Ke(Tile.W[6]),
    new Dui(Tile.B[7]),
  ],
  last: Tile.W[6],
  fans: [DaYuWu, PengPengHu, DuanYao, ShuangTongKe]
})

expectFan({
  mians: [
    new Ke(Tile.T[0], true),
    new Ke(Tile.T[1], true),
    new Ke(Tile.B[2], true),
    new Shun(Tile.W[1]),
    new Dui(Tile.B[1]),
  ],
  last: Tile.B[1],
  fans: [XiaoYuWu, DanDiaoJiang, YaoJiuKe]
})

expectFan({
  mians: [
    ...Tile.F.slice(0, 3).map(t => new Ke(t)),
    new Shun(Tile.B[1]),
    new Dui(Tile.W[3]),
  ],
  last: Tile.B[1],
  options: {menfeng: 1, quanfeng: 2},
  fans: [SanFengKe, QueYiMen, MenFengKe, QuanFengKe, SanAnKe, MenQianQing]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Shun(Tile.B[3], true),
    new Shun(Tile.W[6], true),
    new Ke(Tile.T[4]),
    new Dui(Tile.B[4]),
  ],
  last: Tile.B[4],
  fans: [HuaLong, DanDiaoJiang, WuZi]
})

expectFan({
  mians: [
    new Shun(Tile.B[1], true),
    new Ke(Tile.B[4], true),
    new Shun(Tile.T[3], true),
    new Ke(Tile.Ys.bai),
    new Dui(Tile.B[0]),
  ],
  last: Tile.B[0],
  fans: [TuiBuDao, DanDiaoJiang, JianKe]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Shun(Tile.B[0], true),
    new Shun(Tile.W[0], true),
    new Shun(Tile.B[6]),
    new Dui(Tile.B[4]),
  ],
  last: Tile.B[6],
  fans: [SanSeSanTongShun, PingHu, LaoShaoFu, BianZhang]
})

expectFan({
  mians: [
    new Ke(Tile.T[0], true),
    new Ke(Tile.B[1], true),
    new Ke(Tile.W[2], true),
    new Ke(Tile.T[4]),
    new Dui(Tile.B[4]),
  ],
  last: Tile.B[4],
  fans: [SanSeSanJieGao, PengPengHu, YaoJiuKe, WuZi, DanDiaoJiang]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Ke(Tile.B[1], true),
    new Ke(Tile.W[2], true),
    new Shun(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[4],
  fans: [WuFanHu]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Ke(Tile.B[1], true),
    new Ke(Tile.W[2], true),
    new Shun(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[4],
  options: {lastTile: true, zimo: true},
  fans: [MiaoShouHuiChun]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Ke(Tile.B[1], true),
    new Ke(Tile.W[2], true),
    new Shun(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[4],
  options: {lastTile: true},
  fans: [HaiDiLaoYue]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Ke(Tile.B[1], true, true),
    new Ke(Tile.W[2], true),
    new Shun(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[4],
  options: {gangShang: true, zimo: true},
  fans: [GangShangKaiHua, MingGang]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Ke(Tile.B[1], true),
    new Ke(Tile.W[2], true),
    new Shun(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[4],
  options: {gangShang: true},
  fans: [QiangGangHu]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Ke(Tile.B[1], false, true),
    new Ke(Tile.W[2], false, true),
    new Shun(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[4],
  fans: [ShuangAnGang]
})

expectFan({
  mians: [
    new Ke(Tile.T[0], true),
    new Ke(Tile.B[1], false, true),
    new Ke(Tile.W[3], false, true),
    new Ke(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.Y[0],
  fans: [PengPengHu, SanAnKe, ShuangAnGang, YaoJiuKe, DanDiaoJiang]
})

expectFan({
  mians: [
    new Shun(Tile.T[3], true),
    new Shun(Tile.T[5], true),
    new Ke(Tile.T[7], true),
    new Ke(Tile.T[1]),
    new Dui(Tile.F[3])
  ],
  last: Tile.T[1],
  fans: [HunYiSe, SiGuiYi]
})

expectFan({
  mians: [
    new Shun(Tile.T[1], true),
    new Shun(Tile.B[2], true),
    new Shun(Tile.W[3], true),
    new Ke(Tile.B[4]),
    new Dui(Tile.W[5]),
  ],
  last: Tile.W[5],
  fans: [SanSeSanBuGao, DuanYao, DanDiaoJiang, SiGuiYi]
})

expectFan({
  mians: [
    new Shun(Tile.T[1], true),
    new Shun(Tile.B[2], true),
    new Shun(Tile.W[4], true),
    new Ke(Tile.F[2]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.F[2],
  fans: [WuMenQi, YaoJiuKe]
})

expectFan({
  mians: [
    new Shun(Tile.T[1], true),
    new Shun(Tile.B[2], true),
    new Shun(Tile.W[4], true),
    new Ke(Tile.B[2], true),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.Y[0],
  fans: [QuanQiuRen, SiGuiYi]
})

expectFan({
  mians: [
    new Ke(Tile.Y[0]),
    new Ke(Tile.Y[1]),
    new Shun(Tile.T[0], true),
    new Shun(Tile.T[1]),
    new Dui(Tile.T[2]),
  ],
  last: Tile.T[2],
  fans: [ShuangJianKe, HunYiSe, KanZhang, ShuangAnKe, SiGuiYi]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Ke(Tile.B[1], true, true),
    new Ke(Tile.W[2], false, true),
    new Shun(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[4],
  fans: [MingAnGang]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Ke(Tile.B[0], true),
    new Shun(Tile.W[6]),
    new Ke(Tile.T[8]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[8],
  fans: [QuanDaiYao, YaoJiuKe, YaoJiuKe]
})

expectFan({
  mians: [
    new Shun(Tile.T[0]),
    new Ke(Tile.B[1], false, true),
    new Ke(Tile.W[2]),
    new Shun(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[4],
  options: {zimo: true},
  fans: [BuQiuRen, AnGang, ShuangAnKe]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Ke(Tile.B[1], true, true),
    new Ke(Tile.W[2], true, true),
    new Shun(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[4],
  fans: [ShuangMingGang]
})

expectFan({
  mians: [
    new Shun(Tile.T[0], true),
    new Ke(Tile.B[1], true),
    new Ke(Tile.W[2], true),
    new Shun(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[4],
  options: {juezhang: true},
  fans: [HuJueZhang]
})

expectFan({
  mians: [
    new Shun(Tile.B[0], true),
    new Ke(Tile.Y[1], true),
    new Ke(Tile.W[2], true),
    new Shun(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[4],
  fans: [JianKe]
})

expectFan({
  mians: [
    new Shun(Tile.B[0], true),
    new Ke(Tile.F[1], true),
    new Ke(Tile.W[2], true),
    new Shun(Tile.T[4]),
    new Dui(Tile.Y[0]),
  ],
  last: Tile.T[4],
  options: {quanfeng: 2, menfeng: 2},
  fans: [QuanFengKe, MenFengKe, WuMenQi]
})

// https://github.com/XDean/blog-comment/issues/5#issuecomment-820345670
expectFan({
  mians: [
    new Shun(Tile.B[6], true),
    new Shun(Tile.T[6], true),
    new Shun(Tile.W[6], true),
    new Shun(Tile.T[6]),
    new Dui(Tile.T[5]),
  ],
  last: Tile.T[5],
  fans: [DaYuWu, SanSeSanTongShun, PingHu, YiBanGao]
})

// https://github.com/XDean/blog-comment/issues/5#issuecomment-914003099
expectFan({
  mians: [
    new Ke(Tile.B[6], true),
    new Shun(Tile.T[0]),
    new Shun(Tile.W[6]),
    new Shun(Tile.T[4]),
    new Dui(Tile.F[0]),
  ],
  last: Tile.T[4],
  options: {
    hua: 2
  },
  fans: [WuFanHu, Hua, Hua]
})

// https://github.com/XDean/blog-comment/issues/5#issuecomment-917601166
expectFan({
  name:'bug: 门风+圈风导致幺九刻少计',
  mians: [
    new Ke(Tile.B[0]),
    new Ke(Tile.B[8]),
    new Ke(Tile.W[0]),
    new Ke(Tile.F[0]),
    new Dui(Tile.T[4]),
  ],
  last: Tile.T[4],
  options: {
    menfeng: 1,
    quanfeng: 1,
  },
  fans: [SiAnKe, SanTongKe, QuanFengKe, MenFengKe, YaoJiuKe, YaoJiuKe, YaoJiuKe, DanDiaoJiang]
})