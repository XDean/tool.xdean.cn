export type YinDiao = 0 | 1 | 2 | 3 | 4

export type ParsedChar = {
  value: string
  shengMu: string
  yunMu: string
  yinDiao: YinDiao
  yinDiaoPos: number
}

export type ParsedWord = ParsedChar[]

export type MatchType = 'exact' | 'fussy' | 'none'

export type CharMatch = {
  value: MatchType
  shengMu: MatchType
  yunMu: MatchType
  yinDiao: MatchType
}

export type WordMatch = CharMatch[]

export const ALL_SHENG_MU = 'b p m f d t n l g k h j q r x w y zh ch sh z c s'.split(/\s/g);

export const ALL_YUN_MU = 'a o e ai ei ao ou an en ang eng ong er i ia io ie iao iu ian in iang ing iong u ua uo uai ui uan un uang ueng v ve van vn'
  .split(/\s/g)
  .sort((a, b) => {
    const i = a.length - b.length;
    if (i === 0)
      return a.localeCompare(b);
    return i;
  });
