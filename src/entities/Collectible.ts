import { CollectibleData, CollectibleType, PaintColor, AccessoryName, AABB } from '@/types';
import { COLLECTIBLE_SIZE, COLLECTIBLE_BOBBLE_SPEED, COLLECTIBLE_BOBBLE_AMOUNT } from '@/engine/Physics';

export class Collectible {
  x: number;
  y: number;
  originY: number;
  type: CollectibleType;
  paintColor?: PaintColor;
  accessoryName?: AccessoryName;
  collected: boolean = false;
  bobbleTimer: number = 0;
  collectAnimTimer: number = 0;
  seed: number;

  constructor(data: CollectibleData) {
    this.x = data.x;
    this.y = data.y;
    this.originY = data.y;
    this.type = data.type;
    this.paintColor = data.paintColor;
    this.accessoryName = data.accessoryName;
    this.seed = Math.floor(Math.random() * 65536);
    // Randomize starting bobble phase
    this.bobbleTimer = Math.random() * Math.PI * 2;
  }

  get aabb(): AABB {
    return {
      x: this.x - COLLECTIBLE_SIZE / 2,
      y: this.y - COLLECTIBLE_SIZE / 2,
      width: COLLECTIBLE_SIZE,
      height: COLLECTIBLE_SIZE,
    };
  }

  update(dt: number): void {
    if (this.collected) {
      this.collectAnimTimer += dt;
      return;
    }
    this.bobbleTimer += dt * COLLECTIBLE_BOBBLE_SPEED;
    this.y = this.originY + Math.sin(this.bobbleTimer) * COLLECTIBLE_BOBBLE_AMOUNT;
  }

  collect(): void {
    this.collected = true;
    this.collectAnimTimer = 0;
  }

  reset(): void {
    this.collected = false;
    this.collectAnimTimer = 0;
    this.y = this.originY;
    this.bobbleTimer = Math.random() * Math.PI * 2;
  }
}
