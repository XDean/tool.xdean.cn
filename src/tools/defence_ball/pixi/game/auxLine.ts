import { Vector } from '../../util';
import { autorun, makeAutoObservable } from 'mobx';
import { DashLineShader, SmoothGraphics } from '@pixi/graphics-smooth';
import * as c from './constants';

export class AuxLine {
  start: Vector = Vector.zero;
  end: Vector = Vector.zero;
  object: SmoothGraphics;

  constructor() {
    makeAutoObservable(this);
    this.object = new SmoothGraphics();
    const shader = new DashLineShader({dash: 5, gap: 5});
    autorun(() => {
      this.object.clear();
      this.object.lineStyle({
        width: 2,
        color: 0xffffff,
        shader: shader,
      });

      const d = this.end.minus(this.start);
      const v1 = d.normalize(c.ballRadius * 1.2).add(this.start);
      const v2 = d.normalize(120).add(this.start);
      this.object.moveTo(v1.x, v1.y);
      this.object.lineTo(v2.x, v2.y);
    });
  }
}