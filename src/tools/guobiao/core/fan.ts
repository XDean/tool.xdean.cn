import assert from 'assert';
import {Tile, TileNumberTypes, TilePoint, TileType, TileTypes} from './tile';
import {Combination, Dui, Hand, Ke, QiDui, Shun, Tiles} from './type';

export function calcFan(hand: Hand, comb: Combination): Fan[] {
  assert(comb.toTiles.length === 14, '和牌必须14张');
  const res: Fan[] = [];
  for (let fan of ALL_FANS) {
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

export const ALL_FANS: Fan[] = [];

type FanExclude = Fan | ((fans: Fan[], comb: Combination, hand: Hand) => Fan[])

export class Fan {
  readonly name: string;
  readonly score: number;
  readonly match: (comb: Combination, hand: Hand) => boolean | number;
  readonly exclude?: FanExclude[];
  readonly desc: string;
  readonly sample?: { hand: Hand, desc?: string }[];

  constructor(
    props: {
      name: string;
      score: number;
      match(comb: Combination, hand: Hand): boolean | number
      exclude?: FanExclude[]
      desc?: string
      sample?: { hand: Hand, desc?: string }[]
    },
  ) {
    this.name = props.name;
    this.score = props.score;
    this.match = props.match;
    this.exclude = props.exclude;
    this.desc = props.desc || '';
    this.sample = props.sample;
    ALL_FANS.push(this);
  }

}

export const YiBanGao = new Fan({
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
  desc: '由一种花色2副相同的顺子组成的牌（既可看作三连对子）。',
  sample: [{hand: Hand.create('b334455t666w345z33')}],
});

export const XiXiangFeng = new Fan({
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
  desc: '2种花色2副序数相同的顺子。',
  sample: [{hand: Hand.create('w678b678222w11199')}],
});

export const LianLiu = new Fan({
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
  desc: '一种花色6张相连接的序数牌。',
  sample: [{hand: Hand.create('t345678b999w999t11')}],
});

export const LaoShaoFu = new Fan({
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
  desc: '一种花色牌的123、789两副顺子。',
  sample: [{hand: Hand.create('t123w999b999t789z55')}],
});

export const YaoJiuKe = new Fan({
  score: 1,
  name: '幺九刻',
  match: c => c.mians.filter(m => m.type === 'ke' && m.tile.in(Tile.Yao)).length,
  desc: '一、九序数牌或非圈风门风的字牌组成的刻子（或杠）。',
});

export const MingGang = new Fan({
  score: 1,
  name: '明杠',
  match: c => c.mians.filter(m => m.type === 'ke' && m.gang && m.open).length === 1,
  desc: '自己有暗刻，碰别人打出的一张相同的牌开杠；或自己抓进一张与碰的明刻相同的牌开杠。',
});

export const QueYiMen = new Fan({
  score: 1,
  name: '缺一门',
  match: c => TileNumberTypes.filter(t => c.toTiles.filterType(t as TileType).length === 0).length === 1,
  desc: '和牌中缺少一种花色序数牌。',
});

export const WuZi = new Fan({
  score: 1,
  name: '无字',
  match: c => c.toTiles.filterType('z').length === 0,
  desc: '和牌中没有字牌。',
});

export const BianZhang = new Fan({
  score: 1,
  name: '边张',
  match: (c, h) => c.getMianWith(h.tiles.last)
    .some(m => !m.open && m.type === 'shun' &&
      ((m.tile.point === 1 && h.tiles.last.point === 3) || (m.tile.point === 7 && h.tiles.last.point === 7))),
  desc: '单和123的3及789的7或1233和3、7789和7都为边张。手中有12345和3，56789和7不算和边张。',
});

export const KanZhang = new Fan({
  score: 1,
  name: '坎张',
  match: (c, h) => c.getMianWith(h.tiles.last)
    .some(m => !m.open && m.type === 'shun' && (m.tile.point + 1 === h.tiles.last.point)),
  desc: '和2张牌之间的牌，俗称夹张。4556和5也为坎张，手中有45567和6不算坎张。',
});

export const DanDiaoJiang = new Fan({
  score: 1,
  name: '单钓将',
  match: (c, h) => {
    const last = h.tiles.last;
    return c.getMianWith(last).some(m => m.type === 'dui') &&
      !c.mians.some(m => m.type === 'shun' && !m.open && m.tile.type === last.type &&
        [-3, -2, -1, 0, 1].indexOf(m.tile.point - last.point) !== -1) &&
      !c.mians.some(m => m.type === 'zu-he-long' && last.in(m.tiles));
  },
  desc: '钓单张牌作将成和。就像钓鱼一样，一根鱼竿每次只能钓一条鱼，故衍生成为单钓将。而做将的另一张手牌又被称为饵。',
});

export const ZiMo = new Fan({
  score: 1,
  name: '自摸',
  match: (_c, h) => h.option.zimo,
  desc: '自己抓进牌成和牌。',
});

export const Hua = new Fan({
  score: 1,
  name: '花牌',
  match: (_c, h) => h.option.hua,
  desc: '即春夏秋冬，梅兰竹菊，每花计一分。不计在起和番内，和牌后才能计分。花牌补花成和计自摸分，不计杠上开花。',
});

export const JianKe = new Fan({
  score: 2,
  name: '箭刻',
  match: c => c.mians.filter(m => m.type === 'ke' && m.tile.in(Tile.Y)).length === 1,
  exclude: [YaoJiuKe],
  desc: '由中、发、白3张相同的牌组成的刻子。',
});

export const QuanFengKe: Fan = new Fan({
  score: 2,
  name: '圈风刻',
  match: (c, h) => c.mians.filter(m => m.type === 'ke' && m.tile.type === 'z' && m.tile.point === h.option.quanfeng).length === 1,
  exclude: [
    fans => fans.indexOf(MenFengKe) === -1 && fans.indexOf(YaoJiuKe) !== -1 ? [YaoJiuKe] : [],
  ],
  desc: '与圈风相同的风刻。不计幺九刻。',
});

export const MenFengKe = new Fan({
  score: 2,
  name: '门风刻',
  match: (c, h) => c.mians.filter(m => m.type === 'ke' && m.tile.type === 'z' && m.tile.point === h.option.menfeng).length === 1,
  exclude: [
    fans => fans.indexOf(QuanFengKe) === -1 && fans.indexOf(YaoJiuKe) !== -1 ? [YaoJiuKe] : [],
  ],
  desc: '与本门风相同的风刻。不计幺九刻。',
});

export const MenQianQing = new Fan({
  score: 2,
  name: '门前清',
  match: c => c.mians.every(m => !m.open),
  desc: '没有吃、碰、明杠。',
});

export const PingHu = new Fan({
  score: 2,
  name: '平和',
  match: c => c.mians.map<number>(m => m.type === 'shun' ? 1 : (m.type === 'zu-he-long' ? 3 : 0))
      .reduce((a, b) => a + b) === 4 &&
    c.toTiles.filterType('z').length === 0,
  exclude: [WuZi],
  desc: '由4副顺子及序数牌作将组成的和牌，边、坎、钓不影响平和。不计无字。',
  sample: [{hand: Hand.create('t234w678t456b123w11')}],
});

export const SiGuiYi = new Fan({
  score: 2,
  name: '四归一',
  match: c => c.toTiles.distinct.tiles.map(t => c.toTiles.count(t)).filter(count => count === 4).length,
  desc: '和牌中，有4张相同的牌，不包括杠牌。',
  sample: [{hand: Hand.create('w789t567w999z44433')}],
});

export const ShuangTongKe = new Fan({
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
  desc: '2副序数相同的刻子。',
  sample: [{hand: Hand.create('w555b555t123z44433')}],
});

export const ShuangAnKe = new Fan({
  score: 2,
  name: '双暗刻',
  match: (c, h) => c.mians.filter(m => m.type === 'ke' && m.isAnKe(h)).length === 2,
  desc: '2个暗刻',
  sample: [{hand: Hand.create('w555t555t123456z33')}],
});

export const AnGang = new Fan({
  score: 2,
  name: '暗杠',
  match: c => c.mians.filter(m => m.type === 'ke' && !m.open && m.gang).length === 1,
  desc: '自抓4张相同的牌开杠。',
});

export const DuanYao = new Fan({
  score: 2,
  name: '断幺',
  match: c => Tile.Yao.every(t => c.toTiles.count(t) === 0),
  exclude: [WuZi],
  desc: '和牌中没有一、九及字牌。不计无字。',
});


export const QuanDaiYao = new Fan({
  score: 4,
  name: '全带幺',
  match: c => c.mians.every(m => m.simple && m.toTiles.tiles.some(t => t.in(Tile.Yao))),
  desc: '和牌时，每副牌、将牌都有幺九牌。',
  sample: [{hand: Hand.create('t123w789b111z666t99')}],
});

export const BuQiuRen = new Fan({
  score: 4,
  name: '不求人',
  match: (c, h) => h.option.zimo && c.mians.every(m => !m.open && m.type != '13yao'),
  exclude: [ZiMo, MenQianQing],
  desc: '4副牌及将中没有吃牌、碰牌（包括明杠），自摸和牌，允许暗杠。不计门前清、自摸。',
  sample: [{hand: Hand.create('ab2 lw123666789t55', {zimo: true})}],
});

export const ShuangMingGang = new Fan({
  score: 4,
  name: '双明杠',
  match: c => c.mians.filter(m => m.type === 'ke' && m.gang && m.open).length >= 2,
  exclude: [MingGang, MingGang],
  desc: '2个明杠。',
  sample: [{hand: Hand.create('gb7w8 lt111z444b44')}],
});

export const HuJueZhang = new Fan({
  score: 4,
  name: '和绝张',
  match: (c, h) =>
    (h.option.juezhang && h.tiles.count(h.tiles.last) === 1) ||
    new Tiles(c.mians.filter(m => m.open).flatMap(m => m.toTiles.tiles)).count(h.tiles.last) === 3,
  desc: '若牌池、桌面已亮明同一种牌的3张牌，和所剩的第4张牌。',
});


export const PengPengHu = new Fan({
  score: 6,
  name: '碰碰和',
  match: c => c.mians.filter(m => m.type === 'ke').length === 4,
  desc: '由4副刻子（或杠）、将牌组成的和牌。',
  sample: [{hand: Hand.create('pb7 w8 lt111z444b44')}],
});

export const HunYiSe = new Fan({
  score: 6,
  name: '混一色',
  match: c => c.toTiles.distinctTypes.length == 2 && c.toTiles.filterType('z').length > 0,
  desc: '由一种花色序数牌及字牌组成的和牌。',
  sample: [{hand: Hand.create('b123555777999z55')}],
});

export const SanSeSanBuGao = new Fan({
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
  desc: '3种花色3副依次递增一位序数的顺子。',
  sample: [{hand: Hand.create('w567b678t789z55566')}],
});

export const WuMenQi = new Fan({
  score: 6,
  name: '五门齐',
  match: c => TileTypes.every(t => c.toTiles.filterType(t).length > 0) &&
    Tile.F.some(f => f.in(c.toTiles.tiles)) &&
    Tile.Y.some(f => f.in(c.toTiles.tiles)),
  desc: '和牌时3种序数牌、风、箭牌齐全。不计字牌带来的幺九刻。',
  sample: [{hand: Hand.create('w123t678b444z44455')}],
});

export const QuanQiuRen = new Fan({
  score: 6,
  name: '全求人',
  match: (c, h) => !h.option.zimo && c.mians.filter(m => m.open).length === 4,
  exclude: [DanDiaoJiang],
  desc: '吃牌、碰牌、明杠共进行四次，点和（不可自摸）。不计单钓将。',
  sample: [{hand: Hand.create('ct15 pb3w4 lz33')}],
});

export const ShuangJianKe = new Fan({
  score: 6,
  name: '双箭刻',
  match: c => c.mians.filter(m => m.type === 'ke' && m.tile.in(Tile.Y)).length === 2,
  exclude: [JianKe, YaoJiuKe, YaoJiuKe],
  desc: '2副箭刻（或杠）。不计箭刻。',
  sample: [{hand: Hand.create('z555666b456w78999')}],
});

export const MingAnGang = new Fan({
  score: 6,
  name: '明暗杠',
  match: c => c.mians.filter(m => m.type === 'ke' && m.gang).length === 2 &&
    c.mians.filter(m => m.type === 'ke' && m.gang && m.open).length === 1,
  exclude: [MingGang, AnGang],
  desc: '一个明杠，一个暗杠。不计明杠、暗杠。',
  sample: [{hand: Hand.create('ab7 gw8 lt111z33344')}],
});

export const HuaLong = new Fan({
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
  desc: '3种花色的3副顺子分别为123,456,789。',
  sample: [{hand: Hand.create('b123w456t789z44455')}],
});

export const TuiBuDao = new Fan({
  score: 8,
  name: '推不到',
  match: c => c.toTiles.allIn(Tile.TuiBuDao),
  exclude: [QueYiMen],
  desc: '由牌面图形中心对称的牌组成的和牌，包括[b1234589t24589z7]，不计缺一门',
  sample: [{hand: Hand.create('b234555t456z777b11')}],
});

export const SanSeSanTongShun = new Fan({
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
  desc: '和牌时，有3种花色3副序数相同的顺子。',
  sample: [{hand: Hand.create('b789w789t789z55566')}],
});

export const SanSeSanJieGao = new Fan({
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
  desc: '和牌时，有3种花色3副依次递增一位数的刻子。',
  sample: [{hand: Hand.create('w444b555t666z55566')}],
});

export const WuFanHu = new Fan({
  score: 8,
  name: '无番和',
  match: _ => false,
  desc: '和牌后，数不出任何番。无番和难度较高，且容易受到突发情况干扰，甚至比一些高番种更难达成。',
  sample: [{hand: Hand.create('cb2 lt345w888z11t789')}],
});

export const MiaoShouHuiChun = new Fan({
  score: 8,
  name: '妙手回春',
  match: (_c, h) => h.option.lastTile && h.option.zimo,
  exclude: [ZiMo],
  desc: '自摸牌墙上最后一张牌和牌。不计自摸。',
});

export const HaiDiLaoYue = new Fan({
  score: 8,
  name: '海底捞月',
  match: (_c, h) => h.option.lastTile && !h.option.zimo,
  desc: '和本局打出的最后一张牌。',
});

export const GangShangKaiHua = new Fan({
  score: 8,
  name: '杠上开花',
  match: (c, h) => h.option.gangShang && h.option.zimo &&
    c.mians.filter(m => m.type === 'ke' && m.gang).length > 0,
  exclude: [ZiMo],
  desc: '开杠抓进的牌成和牌。',
});

export const QiangGangHu = new Fan({
  score: 8,
  name: '抢杠和',
  match: (c, h) => h.option.gangShang && !h.option.zimo &&
    c.toTiles.count(h.tiles.last) === 1,
  exclude: [HuJueZhang],
  desc: '和别人加杠的牌。不计和绝张。',
});

export const ShuangAnGang = new Fan({
  score: 8,
  name: '双暗杠',
  match: c => c.mians.filter(m => m.type === 'ke' && !m.open && m.gang).length === 2,
  exclude: [ShuangAnKe],
  desc: '和牌时有两个暗杠。不计暗杠、双暗刻。',
  sample: [{hand: Hand.create('ab7w8 lt111z444b44')}],
});

export const QuanBuKao = new Fan({
  score: 12,
  name: '全不靠',
  match: c => c.mians.filter(m => m.type === 'bu-kao').length === 1,
  exclude: [WuMenQi, MenQianQing, DanDiaoJiang],
  desc: '由单张3种花色147、258、369不能错位的序数牌及东南西北中发白中的任何14张牌组成的和牌。不计五门齐、门前清、单钓将。',
  sample: [{hand: Hand.create('w147b258t36z123567')}],
});

export const ZuHeLongFan = new Fan({
  score: 12,
  name: '组合龙',
  match: c => {
    const bukao = c.mians.filter(m => m.type === 'bu-kao');
    if (bukao.length > 0) {
      return bukao[0].toTiles.filterType(...TileNumberTypes).length === 9;
    }
    return c.mians.filter(m => m.type === 'zu-he-long').length === 1;
  },
  desc: '3种花色的147、258、369不能错位的序数牌，可作为三个顺子或全不靠的附加番。',
  sample: [{hand: Hand.create('w147b258t369w555z44')}],
});

export const DaYuWu = new Fan({
  score: 12,
  name: '大于五',
  match: c => c.toTiles.tiles.every(t => t.type !== 'z' && t.point > 5),
  exclude: [WuZi],
  desc: '由序数牌6~9组成的顺子、刻子、将牌组成的和牌。不计无字。',
  sample: [{hand: Hand.create('b777888t678w789b66')}],
});

export const XiaoYuWu = new Fan({
  score: 12,
  name: '小于五',
  match: c => c.toTiles.tiles.every(t => t.type !== 'z' && t.point < 5),
  exclude: [WuZi],
  desc: '由序数牌1~4组成的顺子、刻子、将牌组成的和牌。不计无字。',
  sample: [{hand: Hand.create('b222333t234w123b44')}],
});

export const SanFengKe = new Fan({
  score: 12,
  name: '三风刻',
  match: c => c.mians.filter(m => m.type === 'ke' && m.tile.in(Tile.F)).length === 3,
  exclude: [YaoJiuKe, YaoJiuKe, YaoJiuKe],
  desc: '3个风刻',
  sample: [{hand: Hand.create('z111222333w567t99')}],
});

export const QingLong = new Fan({
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
  desc: '和牌时，有一种花色的123，456，789三组顺子，不计连六、老少副。',
  sample: [{hand: Hand.create('w123456789z22233')}],
});

export const SanSesHuangLongHui = new Fan({
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
  desc: '2种花色2个老少副、另一种花色5作将的和牌。不计喜相逢、老少副、无字、平和。',
  sample: [{hand: Hand.create('w123789t123789b55')}],
});

export const YiSeSanBuGao = new Fan({
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
  desc: '和牌时，有一种花色3副依次递增一位或依次递增二位数字的顺子。',
  sample: [{hand: Hand.create('t345456567z55566')}],
});

export const QuanDaiWu = new Fan({
  score: 16,
  name: '全带五',
  match: c => c.mians.every(m => m.simple && m.toTiles.tiles.some(t => t.type !== 'z' && t.point === 5)),
  exclude: [DuanYao],
  desc: '每副牌及将牌必须有5的序数牌。不计断幺。',
  sample: [{hand: Hand.create('b555t345w567b456w55')}],
});

export const SanTongKe = new Fan({
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
  desc: '3个序数相同的刻子（杠）。不计双同刻。',
  sample: [{hand: Hand.create('b666t666w666z55566')}],
});

export const SanAnKe = new Fan({
  score: 16,
  name: '三暗刻',
  match: (c, h) => c.mians.filter(m => m.type === 'ke' && m.isAnKe(h)).length === 3,
  desc: '3个暗刻。不计双暗刻。',
  sample: [{hand: Hand.create('b11133355567899')}],
});

export const QiDuiFan = new Fan({
  score: 24,
  name: '七对',
  match: c => c.mians.filter(m => m.type === 'qi-dui').length === 1,
  exclude: [MenQianQing, DanDiaoJiang],
  desc: '由7个对子组成的和牌。不计门前清、单钓将。',
  sample: [{hand: Hand.create('t114455w6677z5566')}],
});

export const QiXingBuKao = new Fan({
  score: 24,
  name: '七星不靠',
  match: c => c.mians.filter(m => m.type === 'bu-kao').length === 1 && c.toTiles.contains(Tile.Z),
  exclude: [WuMenQi, MenQianQing, QuanBuKao],
  desc: '必须有7个单张的东西南北中发白，加上3种花色，数位按147、258、369中的7张序数牌组成没有将牌的和牌。不计五门齐、门前清、单钓将。',
  sample: [{hand: Hand.create('w147b258t3z1234567')}],
});

export const QuanShuangKe = new Fan({
  score: 24,
  name: '全双刻',
  match: c => c.mians.filter(m => m.type === 'ke' && m.tile.point % 2 === 0).length === 4 &&
    c.mians.filter(m => m.type === 'dui' && m.tile.point % 2 === 0).length === 1,
  exclude: [PengPengHu, DuanYao],
  desc: '由2、4、6、8序数牌的刻子、将牌组成的和牌。不计碰碰和、断幺。',
  sample: [{hand: Hand.create('t222b444w222888t44')}],
});

export const QingYiSe = new Fan({
  score: 24,
  name: '清一色',
  match: c => c.toTiles.filterType().length === 14 && c.toTiles.filterType('z').length === 0,
  exclude: [WuZi],
  desc: '由一种花色的序数牌组成的和牌。不计无字。',
  sample: [{hand: Hand.create('w12323455578922')}],
});

export const YiSeSanTongShun = new Fan({
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
  desc: '和牌时有一种花色3副序数相同的顺子。不计一色三节高、一般高。',
  sample: [{hand: Hand.create('tc4 l456456w678z33')}],
});

export const YiSeSanJieGao = new Fan({
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
  desc: '和牌时有一种花色3副依次递增一位数字的刻子，又称三连刻。不计一色三同顺。',
  sample: [{hand: Hand.create('tp4 l555666w678z33')}],
});

export const QuanDa = new Fan({
  score: 24,
  name: '全大',
  match: c => c.toTiles.tiles.every(t => t.type !== 'z' && t.point >= 7),
  exclude: [WuZi, DaYuWu],
  desc: '由序数牌789组成的顺子、刻子（杠）、将牌的和牌。不计无字。',
  sample: [{hand: Hand.create('b777888t789w789b99')}],
});

export const QuanZhong = new Fan({
  score: 24,
  name: '全中',
  match: c => c.toTiles.tiles.every(t => t.type !== 'z' && t.point >= 4 && t.point <= 6),
  exclude: [WuZi, DuanYao],
  desc: '由序数牌456组成的顺子、刻子（杠）、将牌的和牌。不计无字、断幺。',
  sample: [{hand: Hand.create('b555666t456w456b44')}],
});

export const QuanXiao = new Fan({
  score: 24,
  name: '全小',
  match: c => c.toTiles.tiles.every(t => t.type !== 'z' && t.point <= 3),
  exclude: [WuZi, XiaoYuWu],
  desc: '由序数牌123组成的顺子、刻子（杠）、将牌的和牌。不计无字。',
  sample: [{hand: Hand.create('b111333t123w123t22')}],
});


export const YiSeSiBuGao = new Fan({
  score: 32,
  name: '一色四步高',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    return tiles.length === 4 && (tiles.hasSameTypeAndDiff(1) || tiles.hasSameTypeAndDiff(2));
  },
  exclude: [YiSeSanBuGao, LianLiu, LaoShaoFu],
  desc: '一种花色4副依次递增一位数或依次递增二位数的顺子。不计连六、老少副。',
  sample: [
    {hand: Hand.create('w12323434545699')},
    {hand: Hand.create('w123345567789z55')},
  ],
});

export const SanGang = new Fan({
  score: 32,
  name: '三杠',
  match: c => c.mians.filter(m => m.type === 'ke' && m.gang).length >= 3,
  exclude: [ShuangMingGang, MingAnGang, MingGang],
  desc: '3个杠。',
  sample: [{
    hand: Hand.create('aw123 l44455'),
    desc: '另计三暗刻。',
  }],
});

export const HunYaoJiu = new Fan({
  score: 32,
  name: '混幺九',
  match: c => {
    const tiles = c.toTiles;
    const yaojiu = tiles.filterTiles(Tile.YaoJiu).length;
    const zi = tiles.filterTiles(Tile.Z).length;
    return c.mians.every(m => m.type !== '13yao') && yaojiu + zi === 14 && yaojiu !== 0 && zi !== 0;
  },
  exclude: [PengPengHu, QuanDaiYao, YaoJiuKe, YaoJiuKe, YaoJiuKe, YaoJiuKe],
  desc: '由字牌和序数牌一、九的刻子及将牌组成的和牌。不计碰碰和、全带幺、幺九刻。',
  sample: [{hand: Hand.create('t111999w111z55566')}],
});

export const YiSeSiTongShun = new Fan({
  score: 48,
  name: '一色四同顺',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'shun').map(m => (m as Shun).tile));
    return tiles.length === 4 && tiles.distinct.length === 1;
  },
  exclude: [YiSeSanJieGao, YiSeSanTongShun, YiBanGao, YiBanGao, SiGuiYi, SiGuiYi, SiGuiYi, SiGuiYi],
  desc: '一种花色4副序数相同的顺子，不计一色三节高、一般高、四归一。',
  sample: [{hand: Hand.create('t678678678678z55')}],
});

export const YiSeSiJieGao = new Fan({
  score: 48,
  name: '一色四节高',
  match: c => {
    const tiles = new Tiles(c.mians.filter(m => m.type === 'ke').map(m => (m as Ke).tile).filter(t => t.type !== 'z'));
    return tiles.length === 4 && tiles.hasSameTypeAndDiff(1);
  },
  exclude: [YiSeSanTongShun, YiSeSanJieGao, PengPengHu],
  desc: '一种花色4副依次递增一位数的刻子，又称四连刻，不计一色三同顺、碰碰和。',
  sample: [{hand: Hand.create('w111222333444z55')}],
});

export const QingYaoJiu = new Fan({
  score: 64,
  name: '清幺九',
  match: c => c.toTiles.allIn(Tile.YaoJiu),
  exclude: [HunYaoJiu, PengPengHu, ShuangTongKe, QuanDaiYao, YaoJiuKe, YaoJiuKe, YaoJiuKe, YaoJiuKe, WuZi],
  desc: '由序数牌一、九刻子组成的和牌。不计混幺九、碰碰和、双同刻、全带幺、幺九刻、无字。',
  sample: [{hand: Hand.create('t111 b111999 w11199')}],
});

export const XiaoSiXi = new Fan({
  score: 64,
  name: '小四喜',
  match: c => c.toTiles.filterTiles(Tile.F).length === 11,
  exclude: [SanFengKe, YaoJiuKe, YaoJiuKe, YaoJiuKe],
  desc: '和牌时有风牌的3副刻子及将牌。不计三风刻、幺九刻。',
  sample: [{hand: Hand.create('w555z11122233344')}],
});

export const XiaoSanYuan = new Fan({
  score: 64,
  name: '小三元',
  match: c => c.toTiles.filterTiles(Tile.Y).length === 8 && c.mians.filter(m => m.type === 'qi-dui').length === 0,
  exclude: [ShuangJianKe, JianKe],
  desc: '和牌时有箭牌的两副刻子和将牌。不计双箭刻、箭刻。',
  sample: [{hand: Hand.create('b555t678z55566677')}],
});

export const ZiYiSe = new Fan({
  score: 64,
  name: '字一色',
  match: c => c.toTiles.filterType('z').length === 14,
  exclude: [PengPengHu, QuanDaiYao, YaoJiuKe, YaoJiuKe, YaoJiuKe, YaoJiuKe],
  desc: '由字牌的刻子（杠）、将组成的和牌。不计碰碰和、全带幺、幺九刻。',
  sample: [{hand: Hand.create('z11122255566644')}],
});

export const SiAnKe = new Fan({
  score: 64,
  name: '四暗刻',
  match: (c, h) => c.mians.filter(m => m.type === 'ke' && m.isAnKe(h)).length === 4,
  exclude: [PengPengHu, MenQianQing],
  desc: '4个暗刻（暗杠）。不计碰碰和、门前清。',
  sample: [{hand: Hand.create('w11122244455566')}],
});

export const YiSeShuangLong = new Fan({
  score: 64,
  name: '一色双龙会',
  match: c => {
    const tiles = c.toTiles;
    return c.mians.length === 5 && tiles.equals([1, 2, 3, 1, 2, 3, 5, 5, 7, 8, 9, 7, 8, 9].map(p => new Tile(tiles.last.type, p as TilePoint)));
  },
  exclude: [QingYiSe, PingHu, YiBanGao, YiBanGao, LaoShaoFu, LaoShaoFu],
  desc: '一种花色的两个老少副，5为将牌。不计七对、清一色、平和、一般高、老少副、无字。',
  sample: [{hand: Hand.create('w11223377889955')}],
});

export const DaSiXi = new Fan({
  score: 88,
  name: '大四喜',
  match: c => c.hasKe(Tile.F),
  exclude: [QuanFengKe, MenFengKe, SanFengKe, PengPengHu, QuanDaiYao],
  desc: '由4副风刻（杠）组成的和牌。不计圈风刻、门风刻、三风刻、碰碰和。',
  sample: [{hand: Hand.create('z111222333444b88')}],
});

export const DaSanYuan = new Fan({
  score: 88,
  name: '大三元',
  match: c => c.hasKe(Tile.Y),
  exclude: [JianKe, ShuangJianKe, YaoJiuKe, YaoJiuKe, YaoJiuKe],
  desc: '和牌中，有中发白3副刻子。不计箭刻、双箭刻。',
  sample: [{hand: Hand.create('z555666777 t12344')}],
});

export const LvYiSe = new Fan({
  score: 88,
  name: '绿一色',
  match: c => c.toTiles.allIn(Tile.Lv),
  exclude: [HunYiSe],
  desc: '由23468条及发字中的任何牌组成的顺子、刻子、将的和牌。可计混一色、清一色。',
  sample: [{
    hand: Hand.create('t223344666888z66'),
    desc: '另计混一色',
  }],
});

export const JiuLianBaoDeng = new Fan({
  score: 88,
  name: '九莲宝灯',
  match: (c, h) => {
    const tiles = c.toTiles;
    const last = h.tiles.last;
    return c.mians.every(m => !m.open) && // 不鸣牌
      tiles.split(last)[0].equals([1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9].map(p => new Tile(last.type, p as TilePoint)));
  },
  exclude: [QingYiSe, MenQianQing, YaoJiuKe],
  desc: '由一种花色序数牌按1112345678999组成的特定牌型，见同花色任何1张序数牌即成和牌。不计清一色、门前清、幺九刻。',
  sample: [{
    hand: Hand.create('w11123456789999'),
    desc: '听9张牌。',
  }],
});

export const SiGang = new Fan({
  score: 88,
  name: '四杠',
  match: c => c.mians.filter(m => m.type === 'ke' && m.gang).length === 4,
  exclude: [PengPengHu, DanDiaoJiang, SanGang],
  desc: '4个杠。不计碰碰和、单钓将。',
  sample: [
    {
      hand: Hand.create('a-w258-t4 l66'),
      desc: '另计四暗刻',
    },
    {
      hand: Hand.create('a-w258 gt4 l66'),
      desc: '另计三暗刻',
    },
  ],
});

export const LianQiDui = new Fan({
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
  desc: '由一种花色序数牌组成序数相连的7个对子的和牌。不计七对、清一色、门前清、单钓将。',
  sample: [{
    hand: Hand.create('w11223344556677'),
  }],
});

export const ShiSanYao = new Fan({
  score: 88,
  name: '十三幺',
  match: c => c.mians.filter(m => m.type === '13yao').length === 1,
  exclude: [WuMenQi, MenQianQing, HunYaoJiu],
  desc: '由3种序数牌的一、九牌，7种字牌及其中一对作将组成的和牌。不计五门齐、门前清、单钓将。',
  sample: [
    {
      hand: Hand.create('t19 b19 w19 z12345677'),
      desc: '听1张牌，点和或自摸[w9]。',
    },
    {
      hand: Hand.create('t19 b19 w19 z12345677'),
      desc: '听13张牌，可和任意一九及字牌。',
    },
  ],
});