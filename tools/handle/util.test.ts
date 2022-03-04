import { Char, MatchType } from './domain';
import { getCharPinYin, match } from './util';

describe('pinyin', () => {
  it('should work', () => {
    expect(getCharPinYin('好')).toEqual<Char>({
      value: '好',
      shengMu: 'h',
      yunMu: 'ao',
      yinDiao: 3,
      yinDiaoPos: 0,
    });
    expect(getCharPinYin('了')).toEqual<Char>({
      value: '了',
      shengMu: 'l',
      yunMu: 'e',
      yinDiao: 0,
      yinDiaoPos: -1,
    });
    expect(getCharPinYin('日')).toEqual<Char>({
      value: '日',
      shengMu: 'r',
      yunMu: 'i',
      yinDiao: 4,
      yinDiaoPos: 0,
    });
    expect(getCharPinYin('雨')).toEqual<Char>({
      value: '雨',
      shengMu: 'y',
      yunMu: 'u',
      yinDiao: 3,
      yinDiaoPos: 0,
    });
    expect(getCharPinYin('源')).toEqual<Char>({
      value: '源',
      shengMu: 'y',
      yunMu: 'uan',
      yinDiao: 2,
      yinDiaoPos: 1,
    });
    expect(getCharPinYin('亏')).toEqual<Char>({
      value: '亏',
      shengMu: 'k',
      yunMu: 'ui',
      yinDiao: 1,
      yinDiaoPos: 1,
    });
  });
});

describe('match', () => {
  it('should work', () => {
    expect(match([1, 2, 3], [1, 2, 3])).toEqual<MatchType[]>(['exact', 'exact', 'exact']);
    expect(match([1, 2, 3], [3, 2, 1])).toEqual<MatchType[]>(['fussy', 'exact', 'fussy']);
    expect(match([1, 2, 3], [3, 1, 2])).toEqual<MatchType[]>(['fussy', 'fussy', 'fussy']);
    expect(match([3, 3, 2], [1, 2, 3])).toEqual<MatchType[]>(['fussy', 'none', 'fussy']);
    expect(match([3, 3, 3], [1, 2, 3])).toEqual<MatchType[]>(['none', 'none', 'exact']);
    expect(match([4, 5, 6], [1, 2, 3])).toEqual<MatchType[]>(['none', 'none', 'none']);
    expect(match([3, 2, 2], [1, 3, 3])).toEqual<MatchType[]>(['fussy', 'none', 'none']);
    expect(match([3, 2, 2], [1, 3, 3])).toEqual<MatchType[]>(['fussy', 'none', 'none']);
  });
});

export {};