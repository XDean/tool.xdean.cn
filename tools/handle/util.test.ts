import { Char } from './domain';
import { getCharPinYin } from './util';

describe('pinyin', () => {
  it('', () => {
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
      yinDiaoPos: 0,
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

export {};