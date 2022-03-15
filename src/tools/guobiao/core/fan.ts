import assert from 'assert';
import {Tile, TileNumberTypes, TilePoint, TileType, TileTypes} from './tile';
import {Combination, Dui, Fan, Hand, Ke, QiDui, Shun, Tiles} from './type';

export function calcFan(hand: Hand, comb: Combination): Fan[] {
  assert(comb.toTiles.length === 14, '和牌必须14张');
  const res: Fan[] = [];
  for (let fan of allFans) {
    let match = fan.match(comb, hand);
    if (match) {
      if (match === true) {
        match = 1;
      }
      for (let i = 0; i < match; i++) {
        for (let e of fan.exclude || []) {
          let ex: Fan[];
          if (typeof e === 'function') {
            ex = e(res, comb, hand);
          } else {
            ex = [e];
          }
          for (let f of ex) {
            const idx = res.indexOf(f);
            if (idx !== -1) {
              res.splice(idx, 1);
            }
          }
        }
        res.push(fan);
      }
    }
  }
  if (res.filter(e => e !== Hua).length === 0) {
    res.push(WuFanHu);
  }
  if (res.filter(e => e === XiXiangFeng).length === 2 && res.filter(e => e === YiBanGao).length === 1) {
    res.splice(res.indexOf(XiXiangFeng), 1);
  }
  if (res.filter(e => e === XiXiangFeng).length === 2 && res.filter(e => e === LaoShaoFu).length === 2) {
    res.splice(res.indexOf(XiXiangFeng), 1);
  }
  return res;
}

const allFans: FanCalc[] = [];

type FanExclude = Fan | ((fans: Fan[], comb: Combination, hand: Hand) => Fan[])

class FanCalc implements Fan {
  readonly name: string;
  readonly score: number;
  readonly match: (comb: Combination, hand: Hand) => boolean | number;
  readonly exclude?: FanExclude[];

  constructor(
    props: {
      name: string;
      score: number;
      match(comb: Combination, hand: Hand): boolean | number
      exclude?: FanExclude[]
    },
  ) {
    this.name = props.name;
    this.score = props.score;
    this.match = props.match;
    this.exclude = props.exclude;
    allFans.push(this);
  }

}

export const Hua = new FanCalc({
  score: 1,
  name: '花牌',
  match: (_c, h) => h.option.hua,
});

export const YiBanGao = new FanCalc({
  score: 1,
  name: '一般高',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    let meet = 0;
    for (let pair of tiles.pairs()) {
      if (new Tiles(pair).hasSameTypeAndDiff(0)) {
        meet++;
      }
    }
    return Math.min(2, meet);
  },
});

export const XiXiangFeng = new FanCalc({
  score: 1,
  name: '喜相逢',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    let meet = 0;
    for (let pair of tiles.pairs()) {
      const t = new Tiles(pair);
      if (t.hasDiff(0) && t.mostType[1] === 1) {
        meet++;
      }
    }
    return Math.min(2, meet);
  },
});

export const LianLiu = new FanCalc({
  score: 1,
  name: '连六',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    let meet = 0;
    for (let pair of tiles.pairs()) {
      const t = new Tiles(pair);
      if (t.hasDiff(3) && t.mostType[1] === 2) {
        meet++;
      }
    }
    return Math.min(2, meet);
  },
});

export const LaoShaoFu = new FanCalc({
  score: 1,
  name: '老少副',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    let meet = 0;
    for (let pair of tiles.pairs()) {
      const t = new Tiles(pair);
      if (t.hasDiff(6) && t.mostType[1] === 2) {
        meet++;
      }
    }
    return Math.min(2, meet);
  },
});

export const YaoJiuKe = new FanCalc({
  score: 1,
  name: '幺九刻',
  match: c => c.mians.filter(m => m.type === 'ke' && m.tile.in(Tile.Yao)).length,
});

export const MingGang = new FanCalc({
  score: 1,
  name: '明杠',
  match: c => c.mians.filter(m => m.type === 'ke' && m.gang && m.open).length === 1,
});

export const QueYiMen = new FanCalc({
  score: 1,
  name: '缺一门',
  match: c => TileNumberTypes.filter(t => c.toTiles.filterType(t as TileType).length === 0).length === 1,
});

export const WuZi = new FanCalc({
  score: 1,
  name: '无字',
  match: c => c.toTiles.filterType('z').length === 0,
});

export const BianZhang = new FanCalc({
  score: 1,
  name: '边张',
  match: (c, h) => c.getMianWith(h.tiles.last)
    .some(m => !m.open && m.type === 'shun' &&
      ((m.tile.point === 1 && h.tiles.last.point === 3) || (m.tile.point === 7 && h.tiles.last.point === 7))),
});

export const KanZhang = new FanCalc({
  score: 1,
  name: '坎张',
  match: (c, h) => c.getMianWith(h.tiles.last)
    .some(m => !m.open && m.type === 'shun' && (m.tile.point + 1 === h.tiles.last.point)),
});

export const DanDiaoJiang = new FanCalc({
  score: 1,
  name: '单钓将',
  match: (c, h) => {
    const last = h.tiles.last;
    return c.getMianWith(last).some(m => m.type === 'dui') &&
      !c.mians.some(m => m.type === 'shun' && !m.open && m.tile.type === last.type &&
        [-3, -2, -1, 0, 1].indexOf(m.tile.point - last.point) !== -1) &&
      !c.mians.some(m => m.type === 'zu-he-long' && last.in(m.tiles));
  },
});

export const ZiMo = new FanCalc({
  score: 1,
  name: '自摸',
  match: (_c, h) => h.option.zimo,
});


export const JianKe = new FanCalc({
  score: 2,
  name: '箭刻',
  match: c => c.mians.filter(m => m.type === 'ke' && m.tile.in(Tile.Y)).length === 1,
  exclude: [YaoJiuKe],
});

export const QuanFengKe: FanCalc = new FanCalc({
  score: 2,
  name: '圈风刻',
  match: (c, h) => c.mians.filter(m => m.type === 'ke' && m.tile.type === 'z' && m.tile.point === h.option.quanfeng).length === 1,
  exclude: [
    fans => fans.indexOf(MenFengKe) === -1 && fans.indexOf(YaoJiuKe) !== -1 ? [YaoJiuKe] : [],
  ],
});

export const MenFengKe = new FanCalc({
  score: 2,
  name: '门风刻',
  match: (c, h) => c.mians.filter(m => m.type === 'ke' && m.tile.type === 'z' && m.tile.point === h.option.menfeng).length === 1,
  exclude: [
    fans => fans.indexOf(QuanFengKe) === -1 && fans.indexOf(YaoJiuKe) !== -1 ? [YaoJiuKe] : [],
  ],
});

export const MenQianQing = new FanCalc({
  score: 2,
  name: '门前清',
  match: c => c.mians.every(m => !m.open),
});

export const PingHu = new FanCalc({
  score: 2,
  name: '平和',
  match: c => c.mians.map<number>(m => m.type === 'shun' ? 1 : (m.type === 'zu-he-long' ? 3 : 0))
      .reduce((a, b) => a + b) === 4 &&
    c.toTiles.filterType('z').length === 0,
  exclude: [WuZi],
});

export const SiGuiYi = new FanCalc({
  score: 2,
  name: '四归一',
  match: c => c.toTiles.distinct.tiles.map(t => c.toTiles.count(t)).filter(count => count === 4).length,
});

export const ShuangTongKe = new FanCalc({
  score: 2,
  name: '双同刻',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'ke' && m.tile.type !== 'z').map(m => (m as Ke).tile));
    let meet = 0;
    for (let pair of tiles.pairs()) {
      if (new Tiles(pair).hasDiff(0)) {
        meet++;
      }
    }
    return Math.min(2, meet);
  },
});

export const ShuangAnKe = new FanCalc({
  score: 2,
  name: '双暗刻',
  match: (c, h) => c.mians.filter(m => m.type === 'ke' && m.isAnKe(h)).length === 2,
});

export const AnGang = new FanCalc({
  score: 2,
  name: '暗杠',
  match: c => c.mians.filter(m => m.type === 'ke' && !m.open && m.gang).length === 1,
});

export const DuanYao = new FanCalc({
  score: 2,
  name: '断幺',
  match: c => Tile.Yao.every(t => c.toTiles.count(t) === 0),
  exclude: [WuZi],
});


export const QuanDaiYao = new FanCalc({
  score: 4,
  name: '全带幺',
  match: c => c.mians.every(m => m.simple && m.toTiles.tiles.some(t => t.in(Tile.Yao))),
});

export const BuQiuRen = new FanCalc({
  score: 4,
  name: '不求人',
  match: (c, h) => h.option.zimo && c.mians.every(m => !m.open && m.type != '13yao'),
  exclude: [ZiMo, MenQianQing],
});

export const ShuangMingGang = new FanCalc({
  score: 4,
  name: '双明杠',
  match: c => c.mians.filter(m => m.type === 'ke' && m.gang && m.open).length >= 2,
  exclude: [MingGang, MingGang],
});

export const HuJueZhang = new FanCalc({
  score: 4,
  name: '和绝张',
  match: (c, h) =>
    (h.option.juezhang && h.tiles.count(h.tiles.last) === 1) ||
    new Tiles(c.mians.filter(m => m.open).flatMap(m => m.toTiles.tiles)).count(h.tiles.last) === 3,
});


export const PengPengHu = new FanCalc({
  score: 6,
  name: '碰碰和',
  match: c => c.mians.filter(m => m.type === 'ke').length === 4,
});

export const HunYiSe = new FanCalc({
  score: 6,
  name: '混一色',
  match: c => c.toTiles.distinctTypes.length == 2 && c.toTiles.filterType('z').length > 0,
});

export const SanSeSanBuGao = new FanCalc({
  score: 6,
  name: '三色三步高',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    for (let triple of tiles.triples()) {
      const t = new Tiles(triple);
      if (t.mostType[1] === 1 && t.hasDiff(1)) {
        return true;
      }
    }
    return false;
  },
});

export const WuMenQi = new FanCalc({
  score: 6,
  name: '五门齐',
  match: c => TileTypes.every(t => c.toTiles.filterType(t).length > 0) &&
    Tile.F.some(f => f.in(c.toTiles.tiles)) &&
    Tile.Y.some(f => f.in(c.toTiles.tiles)),
});

export const QuanQiuRen = new FanCalc({
  score: 6,
  name: '全求人',
  match: (c, h) => !h.option.zimo && c.mians.filter(m => m.open).length === 4,
  exclude: [DanDiaoJiang],
});

export const ShuangJianKe = new FanCalc({
  score: 6,
  name: '双箭刻',
  match: c => c.mians.filter(m => m.type === 'ke' && m.tile.in(Tile.Y)).length === 2,
  exclude: [JianKe, YaoJiuKe, YaoJiuKe],
});

export const MingAnGang = new FanCalc({
  score: 6,
  name: '明暗杠',
  match: c => c.mians.filter(m => m.type === 'ke' && m.gang).length === 2 &&
    c.mians.filter(m => m.type === 'ke' && m.gang && m.open).length === 1,
  exclude: [MingGang, AnGang],
});

export const HuaLong = new FanCalc({
  score: 8,
  name: '花龙',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    for (let triple of tiles.triples()) {
      const t = new Tiles(triple);
      if (t.mostType[1] === 1 && t.hasDiff(3)) {
        return true;
      }
    }
    return false;
  },
});

export const TuiBuDao = new FanCalc({
  score: 8,
  name: '推不到',
  match: c => c.toTiles.allIn(Tile.TuiBuDao),
  exclude: [QueYiMen],
});

export const SanSeSanTongShun = new FanCalc({
  score: 8,
  name: '三色三同顺',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    for (let triple of tiles.triples()) {
      const t = new Tiles(triple);
      if (t.mostPoint[1] === 3 && t.distinctTypes.length === 3) {
        return true;
      }
    }
    return false;
  },
  exclude: [XiXiangFeng, XiXiangFeng],
});

export const SanSeSanJieGao = new FanCalc({
  score: 8,
  name: '三色三节高',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'ke').map(m => (m as Ke).tile).filter(t => t.type != 'z'));
    for (let triple of tiles.triples()) {
      const t = new Tiles(triple);
      if (t.mostType[1] === 1 && t.hasDiff(1)) {
        return true;
      }
    }
    return false;
  },
});

export const WuFanHu = new FanCalc({
  score: 8,
  name: '无番和',
  match: _ => false,
});

export const MiaoShouHuiChun = new FanCalc({
  score: 8,
  name: '妙手回春',
  match: (_c, h) => h.option.lastTile && h.option.zimo,
  exclude: [ZiMo],
});

export const HaiDiLaoYue = new FanCalc({
  score: 8,
  name: '海底捞月',
  match: (_c, h) => h.option.lastTile && !h.option.zimo,
});

export const GangShangKaiHua = new FanCalc({
  score: 8,
  name: '杠上开花',
  match: (c, h) => h.option.gangShang && h.option.zimo &&
    c.mians.filter(m => m.type === 'ke' && m.gang).length > 0,
  exclude: [ZiMo],
});

export const QiangGangHu = new FanCalc({
  score: 8,
  name: '抢杠和',
  match: (c, h) => h.option.gangShang && !h.option.zimo &&
    c.toTiles.count(h.tiles.last) === 1,
  exclude: [HuJueZhang],
});

export const ShuangAnGang = new FanCalc({
  score: 8,
  name: '双暗杠',
  match: c => c.mians.filter(m => m.type === 'ke' && !m.open && m.gang).length === 2,
  exclude: [ShuangAnKe],
});

export const QuanBuKao = new FanCalc({
  score: 12,
  name: '全不靠',
  match: c => c.mians.filter(m => m.type === 'bu-kao').length === 1,
  exclude: [WuMenQi, MenQianQing, DanDiaoJiang],
});

export const ZuHeLongFan = new FanCalc({
  score: 12,
  name: '组合龙',
  match: c => {
    const bukao = c.mians.filter(m => m.type === 'bu-kao');
    if (bukao.length > 0) {
      return bukao[0].toTiles.filterType(...TileNumberTypes).length === 9;
    }
    return c.mians.filter(m => m.type === 'zu-he-long').length === 1;
  },
});

export const DaYuWu = new FanCalc({
  score: 12,
  name: '大于五',
  match: c => c.toTiles.tiles.every(t => t.type !== 'z' && t.point > 5),
  exclude: [WuZi],
});

export const XiaoYuWu = new FanCalc({
  score: 12,
  name: '小于五',
  match: c => c.toTiles.tiles.every(t => t.type !== 'z' && t.point < 5),
  exclude: [WuZi],
});

export const SanFengKe = new FanCalc({
  score: 12,
  name: '三风刻',
  match: c => c.mians.filter(m => m.type === 'ke' && m.tile.in(Tile.F)).length === 3,
  exclude: [YaoJiuKe, YaoJiuKe, YaoJiuKe],
});

export const QingLong = new FanCalc({
  score: 16,
  name: '清龙',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    for (let triple of tiles.triples()) {
      if (new Tiles(triple).hasSameTypeAndDiff(3)) {
        return true;
      }
    }
    return false;
  },
  exclude: [LianLiu, LianLiu, LaoShaoFu],
});

export const SanSesHuangLongHui = new FanCalc({
  score: 16,
  name: '三色双龙会',
  match: c => {
    if (c.toTiles.filterType('z').length > 0) {
      return false;
    }
    const duis = c.mians.filter(m => m.type === 'dui');
    if (duis.length !== 1) {
      return false;
    }
    const duiTile = (duis[0] as Dui).tile;
    if (duiTile.point !== 5) {
      return false;
    }
    const types = [...TileTypes];
    types.splice(types.indexOf('z'), 1);
    types.splice(types.indexOf(duiTile.type), 1);
    const shuns = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    return shuns.length === 4 && shuns.equals([1, 7].flatMap(p => types.map(t => new Tile(t, p as TilePoint))));
  },
  exclude: [XiXiangFeng, XiXiangFeng, LaoShaoFu, LaoShaoFu, PingHu],
});

export const YiSeSanBuGao = new FanCalc({
  score: 16,
  name: '一色三步高',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    for (let triple of tiles.triples()) {
      const t = new Tiles(triple);
      if (t.hasSameTypeAndDiff(1) || t.hasSameTypeAndDiff(2)) {
        return true;
      }
    }
    return false;
  },
});

export const QuanDaiWu = new FanCalc({
  score: 16,
  name: '全带五',
  match: c => c.mians.every(m => m.simple && m.toTiles.tiles.some(t => t.type !== 'z' && t.point === 5)),
  exclude: [DuanYao],
});

export const SanTongKe = new FanCalc({
  score: 16,
  name: '三同刻',
  match: c => {
    const kes = new Tiles(c.mians.filter(m => m.type === 'ke' && m.tile.type !== 'z').map(m => (m as Ke).tile));
    for (let triple of kes.triples()) {
      if (new Tiles(triple).hasDiff(0)) {
        return true;
      }
    }
    return false;
  },
  exclude: [ShuangTongKe, ShuangTongKe],
});

export const SanAnKe = new FanCalc({
  score: 16,
  name: '三暗刻',
  match: (c, h) => c.mians.filter(m => m.type === 'ke' && m.isAnKe(h)).length === 3,
});

export const QiDuiFan = new FanCalc({
  score: 24,
  name: '七对',
  match: c => c.mians.filter(m => m.type === 'qi-dui').length === 1,
  exclude: [MenQianQing, DanDiaoJiang],
});

export const QiXingBuKao = new FanCalc({
  score: 24,
  name: '七星不靠',
  match: c => c.mians.filter(m => m.type === 'bu-kao').length === 1 && c.toTiles.contains(Tile.Z),
  exclude: [WuMenQi, MenQianQing, QuanBuKao],
});

export const QuanShuangKe = new FanCalc({
  score: 24,
  name: '全双刻',
  match: c => c.mians.filter(m => m.type === 'ke' && m.tile.point % 2 === 0).length === 4 &&
    c.mians.filter(m => m.type === 'dui' && m.tile.point % 2 === 0).length === 1,
  exclude: [PengPengHu, DuanYao],
});

export const QingYiSe = new FanCalc({
  score: 24,
  name: '清一色',
  match: c => c.toTiles.filterType().length === 14 && c.toTiles.filterType('z').length === 0,
  exclude: [WuZi],
});

export const YiSeSanTongShun = new FanCalc({
  score: 24,
  name: '一色三同顺',
  match: c => {
    const shuns = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    for (let triple of shuns.triples()) {
      if (new Tiles(triple).hasSameTypeAndDiff(0)) {
        return true;
      }
    }
    return false;
  },
  exclude: [YiBanGao, YiBanGao],
});

export const YiSeSanJieGao = new FanCalc({
  score: 24,
  name: '一色三节高',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'ke').map(m => (m as Ke).tile).filter(t => t.type !== 'z'));
    for (let triple of tiles.triples()) {
      if (new Tiles(triple).hasSameTypeAndDiff(1)) {
        return true;
      }
    }
    return false;
  },
});

export const QuanDa = new FanCalc({
  score: 24,
  name: '全大',
  match: c => c.toTiles.tiles.every(t => t.type !== 'z' && t.point >= 7),
  exclude: [WuZi, DaYuWu],
});

export const QuanZhong = new FanCalc({
  score: 24,
  name: '全中',
  match: c => c.toTiles.tiles.every(t => t.type !== 'z' && t.point >= 4 && t.point <= 6),
  exclude: [WuZi, DuanYao],
});

export const QuanXiao = new FanCalc({
  score: 24,
  name: '全小',
  match: c => c.toTiles.tiles.every(t => t.type !== 'z' && t.point <= 3),
  exclude: [WuZi, XiaoYuWu],
});


export const YiSeSiBuGao = new FanCalc({
  score: 32,
  name: '一色四步高',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    return tiles.length === 4 && (tiles.hasSameTypeAndDiff(1) || tiles.hasSameTypeAndDiff(2));
  },
  exclude: [YiSeSanBuGao, LianLiu, LaoShaoFu],
});

export const SanGang = new FanCalc({
  score: 32,
  name: '三杠',
  match: c => c.mians.filter(m => m.type === 'ke' && m.gang).length >= 3,
  exclude: [ShuangMingGang, MingAnGang, MingGang],
});

export const HunYaoJiu = new FanCalc({
  score: 32,
  name: '混幺九',
  match: c => {
    const tiles = c.toTiles;
    const yaojiu = tiles.filterTiles(Tile.YaoJiu).length;
    const zi = tiles.filterTiles(Tile.Z).length;
    return c.mians.every(m => m.type !== '13yao') && yaojiu + zi === 14 && yaojiu !== 0 && zi !== 0;
  },
  exclude: [PengPengHu, QuanDaiYao, YaoJiuKe, YaoJiuKe, YaoJiuKe, YaoJiuKe],
});

export const YiSeSiTongShun = new FanCalc({
  score: 48,
  name: '一色四同顺',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    return tiles.length === 4 && tiles.distinct.length === 1;
  },
  exclude: [YiSeSanJieGao, YiSeSanTongShun, YiBanGao, YiBanGao, SiGuiYi, SiGuiYi, SiGuiYi, SiGuiYi],
});

export const YiSeSiJieGao = new FanCalc({
  score: 48,
  name: '一色四节高',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'ke').map(m => (m as Ke).tile).filter(t => t.type !== 'z'));
    return tiles.length === 4 && tiles.hasSameTypeAndDiff(1);
  },
  exclude: [YiSeSanTongShun, YiSeSanJieGao, PengPengHu],
});

export const QingYaoJiu = new FanCalc({
  score: 64,
  name: '清幺九',
  match: c => c.toTiles.allIn(Tile.YaoJiu),
  exclude: [HunYaoJiu, PengPengHu, ShuangTongKe, QuanDaiYao, YaoJiuKe, YaoJiuKe, YaoJiuKe, YaoJiuKe, WuZi],
});

export const XiaoSiXi = new FanCalc({
  score: 64,
  name: '小四喜',
  match: c => c.toTiles.filterTiles(Tile.F).length === 11,
  exclude: [SanFengKe, YaoJiuKe, YaoJiuKe, YaoJiuKe],
});

export const XiaoSanYuan = new FanCalc({
  score: 64,
  name: '小三元',
  match: c => c.toTiles.filterTiles(Tile.Y).length === 8 && c.mians.filter(m => m.type === 'qi-dui').length === 0,
  exclude: [ShuangJianKe, JianKe],
});

export const ZiYiSe = new FanCalc({
  score: 64,
  name: '字一色',
  match: c => c.toTiles.filterType('z').length === 14,
  exclude: [PengPengHu, QuanDaiYao, YaoJiuKe, YaoJiuKe, YaoJiuKe, YaoJiuKe],
});

export const SiAnKe = new FanCalc({
  score: 64,
  name: '四暗刻',
  match: (c, h) => c.mians.filter(m => m.type === 'ke' && m.isAnKe(h)).length === 4,
  exclude: [PengPengHu, MenQianQing],
});

export const YiSeShuangLong = new FanCalc({
  score: 64,
  name: '一色双龙会',
  match: c => {
    const tiles = c.toTiles;
    return c.mians.length === 5 && tiles.equals([1, 2, 3, 1, 2, 3, 5, 5, 7, 8, 9, 7, 8, 9].map(p => new Tile(tiles.last.type, p as TilePoint)));
  },
  exclude: [QingYiSe, PingHu, YiBanGao, YiBanGao, LaoShaoFu, LaoShaoFu],
});

export const DaSiXi = new FanCalc({
  score: 88,
  name: '大四喜',
  match: c => c.hasKe(Tile.F),
  exclude: [QuanFengKe, MenFengKe, SanFengKe, PengPengHu, QuanDaiYao],
});

export const DaSanYuan = new FanCalc({
  score: 88,
  name: '大三元',
  match: c => c.hasKe(Tile.Y),
  exclude: [JianKe, ShuangJianKe, YaoJiuKe, YaoJiuKe, YaoJiuKe],
});

export const LvYiSe = new FanCalc({
  score: 88,
  name: '绿一色',
  match: c => c.toTiles.allIn(Tile.Lv),
  exclude: [HunYiSe],
});

export const JiuLianBaoDeng = new FanCalc({
  score: 88,
  name: '九莲宝灯',
  match: (c, h) => {
    const tiles = c.toTiles;
    const last = h.tiles.last;
    return c.mians.every(m => !m.open) && // 不鸣牌
      tiles.split(last)[0].equals([1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9].map(p => new Tile(last.type, p as TilePoint)));
  },
  exclude: [QingYiSe, MenQianQing, YaoJiuKe],
});

export const SiGang = new FanCalc({
  score: 88,
  name: '四杠',
  match: c => c.mians.filter(m => m.type === 'ke' && m.gang).length === 4,
  exclude: [PengPengHu, DanDiaoJiang, SanGang],
});

export const LianQiDui = new FanCalc({
  score: 88,
  name: '连七对',
  match: c => {
    const find = c.mians.filter(m => m.type === 'qi-dui');
    if (find.length === 0) {
      return false;
    }
    const qidui = find[0] as QiDui;
    const tiles = qidui.tiles.filterType(qidui.tiles.last.type).distinct;
    return tiles.last.type !== 'z' && tiles.length === 7 && tiles.maxPointTile.point - tiles.minPointTile.point === 6;
  },
  exclude: [QiDuiFan, QingYiSe, MenQianQing, DanDiaoJiang],
});

export const ShiSanYao = new FanCalc({
  score: 88,
  name: '十三幺',
  match: c => c.mians.filter(m => m.type === '13yao').length === 1,
  exclude: [WuMenQi, MenQianQing, HunYaoJiu],
});