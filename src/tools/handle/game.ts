import { Idiom } from 'idiom';
import { makeAutoObservable, when } from 'mobx';
import { MatchType } from './domain';
import { formatDuration, getWordPinYin, matchWord } from './util';

export class Game {

  tries: string[] = [];
  startTime: number = new Date().getTime();
  endTime: number = -1;
  useHint: boolean = false;

  constructor(
    readonly answer: string,
    readonly details?: Idiom,
  ) {
    makeAutoObservable(this);
    const dispose = when(() => this.correct, () => {
      this.endTime = new Date().getTime();
      dispose();
    });
  }

  get correct() {
    return this.tries.some(e => e === this.answer);
  }

  guess(word: string) {
    this.tries.push(word);
  }

  get answerPinyin() {
    return getWordPinYin(this.answer);
  }

  get cheatSheet() {
    const sm = new Map<string, MatchType>();
    const ym = new Map<string, MatchType>();
    const mergeCalcType = (a: MatchType, b?: MatchType): MatchType => {
      if (a === 'exact' || b === 'exact') {
        return 'exact';
      } else if (a === 'fussy' || b === 'fussy') {
        return 'fussy';
      } else {
        return 'none';
      }
    };
    this.tries.forEach(t => {
      const py = getWordPinYin(t);
      const match = matchWord(py, this.answerPinyin);
      py.forEach((c, i) => {
        sm.set(c.shengMu, mergeCalcType(match[i].shengMu, sm.get(c.shengMu)));
        ym.set(c.yunMu, mergeCalcType(match[i].yunMu, ym.get(c.yunMu)));
      });
    });
    return {
      sm,
      ym,
    };
  }

  get totalTimeStr() {
    return formatDuration(this.endTime - this.startTime);
  }

  static async fetchGame(id?: string): Promise<Game> {
    const idiom = await fetch(`/api/idiom?type=simple&id=${id ?? 'NaN'}`)
      .then(e => {
        if (e.ok) {
          return e;
        } else {
          return fetch(`/api/idiom?type=simple`);
        }
      })
      .then<Idiom>(e => e.json());
    return new Game(idiom.word, idiom);
  }
}