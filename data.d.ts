declare module 'idiom' {
  export type Idiom = {
    id: number,
    derivation: string,
    example: string,
    explanation: string,
    pinyin: string,
    word: string,
    abbreviation: string,
  }
}

declare module 'public/data/idiom.json' {
  declare const idioms: Idiom[];
  export default idioms;
}
declare module 'public/data/idiom_simple.json' {
  declare const idioms: string[];
  export default idioms;
}