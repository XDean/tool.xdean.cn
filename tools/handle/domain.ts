export type YinDiao = 0 | 1 | 2 | 3 | 4

export type Char = {
  value: string
  shengMu: string
  yunMu: string
  yinDiao: YinDiao
  yinDiaoPos: number
}

export type Word = [Char, Char, Char, Char]