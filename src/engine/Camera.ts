import { lerp, clamp } from '@/utils/math';
import { CANVAS_HEIGHT, LEVEL_HEIGHT } from './Physics';

export class Camera {
  y: number = 0; // Top of the viewport in world coordinates
  targetY: number = 0;
  highestY: number = LEVEL_HEIGHT; // Track the highest point reached
  shakeX: number = 0;
  shakeY: number = 0;
  private shakeIntensity: number = 0;
  private shakeDuration: number = 0;
  private shakeTimer: number = 0;

  // Camera follows player but never scrolls down
  update(playerY: number, dt: number): void {
    // Target: keep player in the lower 40% of screen
    const targetOffset = CANVAS_HEIGHT * 0.4;
    const desiredY = playerY - targetOffset;

    // Only scroll up (never down) — track highest point
    if (desiredY < this.highestY) {
      this.highestY = desiredY;
    }
    this.targetY = this.highestY;

    // Clamp to level bounds
    this.targetY = clamp(this.targetY, 0, LEVEL_HEIGHT - CANVAS_HEIGHT);

    // Smooth follow with lerp
    this.y = lerp(this.y, this.targetY, 1 - Math.pow(0.001, dt));

    // Update screen shake
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
      const intensity = this.shakeIntensity * (this.shakeTimer / this.shakeDuration);
      this.shakeX = (Math.random() - 0.5) * 2 * intensity;
      this.shakeY = (Math.random() - 0.5) * 2 * intensity;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
    }
  }

  shake(intensity: number, duration: number): void {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  // Convert world Y to screen Y
  worldToScreen(worldY: number): number {
    return worldY - this.y;
  }

  // Check if a world Y position is visible on screen
  isVisible(worldY: number, height: number = 0): boolean {
    return worldY + height > this.y && worldY < this.y + CANVAS_HEIGHT;
  }

  reset(): void {
    this.y = LEVEL_HEIGHT - CANVAS_HEIGHT;
    this.targetY = this.y;
    this.highestY = this.y;
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeTimer = 0;
  }
}
