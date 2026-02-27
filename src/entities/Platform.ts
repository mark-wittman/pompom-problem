import { PlatformData, PlatformType, AABB } from '@/types';
import { PLATFORM_HEIGHT } from '@/engine/Physics';

export class Platform {
  x: number;
  y: number;
  width: number;
  type: PlatformType;
  originX: number;
  originY: number;
  moveRange: number;
  moveSpeed: number;
  moveAxis: 'x' | 'y';
  moveTimer: number = 0;

  // Crumbly platform state
  crumbleTimer: number = 0;
  isCrumbling: boolean = false;
  isGone: boolean = false;
  crumbleDuration: number = 0.5; // Shakes for 0.5s then falls
  shakeOffset: number = 0;

  // Rough.js cached drawable seed
  seed: number;

  constructor(data: PlatformData) {
    this.x = data.x;
    this.y = data.y;
    this.width = data.width;
    this.type = data.type;
    this.originX = data.x;
    this.originY = data.y;
    this.moveRange = data.moveRange || 0;
    this.moveSpeed = data.moveSpeed || 1;
    this.moveAxis = data.moveAxis || 'x';
    this.seed = Math.floor(Math.random() * 65536);
  }

  get aabb(): AABB {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: PLATFORM_HEIGHT,
    };
  }

  update(dt: number): void {
    if (this.isGone) return;

    // Moving platform
    if (this.type === 'moving') {
      this.moveTimer += dt * this.moveSpeed;
      if (this.moveAxis === 'x') {
        this.x = this.originX + Math.sin(this.moveTimer) * this.moveRange;
      } else {
        this.y = this.originY + Math.sin(this.moveTimer) * this.moveRange;
      }
    }

    // Crumbling platform
    if (this.type === 'crumbly' && this.isCrumbling) {
      this.crumbleTimer += dt;
      this.shakeOffset = (Math.random() - 0.5) * 4;
      if (this.crumbleTimer >= this.crumbleDuration) {
        this.isGone = true;
      }
    }
  }

  triggerCrumble(): void {
    if (this.type === 'crumbly' && !this.isCrumbling) {
      this.isCrumbling = true;
      this.crumbleTimer = 0;
    }
  }

  reset(): void {
    this.x = this.originX;
    this.y = this.originY;
    this.moveTimer = 0;
    this.crumbleTimer = 0;
    this.isCrumbling = false;
    this.isGone = false;
    this.shakeOffset = 0;
  }
}
