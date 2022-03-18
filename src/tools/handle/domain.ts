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