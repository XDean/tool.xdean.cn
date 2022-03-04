import pinyin from 'pinyin';
import { Char, YinDiao } from './domain';

export function getCharPinYin(value: string): Char {
  const char = value[0];
  const py = pinyin(char, {style: pinyin.STYLE_TO3NE})[0][0];
  let shengMu = pinyin(char, {style: pinyin.STYLE_INITIALS})[0][0];
  if (shengMu.length === 0) {
    switch (py[0]) {
      case 'y':
      case 'w':
        shengMu = py[0];
        break;
    }
  }
  const yunMuWithShengDiao = py.slice(shengMu.length);
  const split = yunMuWithShengDiao.split(/\d/);
  const yinDiao = (split.length === 2 ? Number(yunMuWithShengDiao.charAt(split[0].length)) : 0) as YinDiao;
  const yinDiaoPos = split.length === 2 ? split[0].length - 1 : 0;
  return {
    value: char,
    shengMu,
    yunMu: split.join(''),
    yinDiao,
    yinDiaoPos,
  };
}