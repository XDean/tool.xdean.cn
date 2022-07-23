import * as pixi from 'pixi.js';

export abstract class Cube {
  abstract object: pixi.DisplayObject;

  tick(_millis: number): void {

  }
}