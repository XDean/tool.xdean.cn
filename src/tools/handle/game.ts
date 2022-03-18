import { Idiom } from 'idiom';
import { makeAutoObservable } from 'mobx';

export class Game {

  tries: string[] = [];
  startTime: number = new Date().getTime();
  endTime: number = -1;

  constructor(
    readonly answer: string,
    readonly details?: Idiom,
  ) {
    makeAutoObservable(this);
  }

  get correct() {
    return this.tries.some(e => e === this.answer);
  }

  guess(word: string) {
    this.tries.push(word);
  }

  static async newGame(): Promise<Game> {
    const idiom = await fetch('/api/idiom?type=simple').then<Idiom>(e => e.json());
    return new Game(idiom.word, idiom);
  }
}