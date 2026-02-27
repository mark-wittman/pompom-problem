import { InputState, PaintColor, AccessoryName } from '@/types';
import {
  GRAVITY,
  JUMP_VELOCITY,
  JUMP_CUT_MULTIPLIER,
  MAX_FALL_SPEED,
  MOVE_SPEED,
  MOVE_ACCEL,
  MOVE_DECEL,
  AIR_CONTROL,
  COYOTE_TIME,
  JUMP_BUFFER_TIME,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  LEVEL_WIDTH,
  LEVEL_HEIGHT,
} from '@/engine/Physics';
import { clamp } from '@/utils/math';

export type PomPomState = 'idle' | 'running' | 'jumping' | 'falling' | 'landing' | 'ducking';

export class PomPom {
  x: number;
  y: number;
  prevY: number;
  vx: number = 0;
  vy: number = 0;
  width: number = PLAYER_WIDTH;
  height: number = PLAYER_HEIGHT;

  state: PomPomState = 'idle';
  facingRight: boolean = true;
  isGrounded: boolean = false;

  // Jump mechanics
  coyoteTimer: number = 0;
  jumpBufferTimer: number = 0;
  isJumping: boolean = false;

  // Squash/stretch
  squashX: number = 1;
  squashY: number = 1;
  private squashTimer: number = 0;

  // Landing animation
  landingTimer: number = 0;

  // Color and accessories
  color: PaintColor = 'white';
  targetColor: PaintColor = 'white';
  colorTransition: number = 1; // 0 = transitioning, 1 = done
  accessories: Set<AccessoryName> = new Set();

  // Idle animation
  idleTimer: number = 0;

  // Eye blink
  blinkTimer: number = 0;
  isBlinking: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.prevY = y;
  }

  get centerX(): number {
    return this.x + this.width / 2;
  }

  get centerY(): number {
    return this.y + this.height / 2;
  }

  get bottom(): number {
    return this.y + this.height;
  }

  update(input: InputState, dt: number): void {
    this.prevY = this.y;

    // Horizontal movement
    const moveControl = this.isGrounded ? 1 : AIR_CONTROL;
    if (input.left) {
      this.vx -= MOVE_ACCEL * moveControl * dt;
      this.facingRight = false;
    } else if (input.right) {
      this.vx += MOVE_ACCEL * moveControl * dt;
      this.facingRight = true;
    } else {
      // Decelerate
      if (Math.abs(this.vx) < MOVE_DECEL * dt) {
        this.vx = 0;
      } else {
        this.vx -= Math.sign(this.vx) * MOVE_DECEL * dt;
      }
    }
    this.vx = clamp(this.vx, -MOVE_SPEED, MOVE_SPEED);

    // Jump buffering
    if (input.jumpPressed) {
      this.jumpBufferTimer = JUMP_BUFFER_TIME;
    }
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= dt;
    }

    // Coyote time
    if (this.isGrounded) {
      this.coyoteTimer = COYOTE_TIME;
    } else {
      this.coyoteTimer -= dt;
    }

    // Jump
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0 && !this.isJumping) {
      this.vy = JUMP_VELOCITY;
      this.isJumping = true;
      this.isGrounded = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      // Stretch on jump
      this.applySquash(0.8, 1.2);
    }

    // Variable jump height (release to cut short)
    if (input.jumpReleased && this.vy < 0 && this.isJumping) {
      this.vy *= JUMP_CUT_MULTIPLIER;
    }

    // Gravity
    this.vy += GRAVITY * dt;
    this.vy = Math.min(this.vy, MAX_FALL_SPEED);

    // Apply velocity
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Wrap horizontally
    if (this.x + this.width < 0) this.x = LEVEL_WIDTH;
    if (this.x > LEVEL_WIDTH) this.x = -this.width;

    // Don't fall below level bottom
    if (this.y + this.height > LEVEL_HEIGHT) {
      this.y = LEVEL_HEIGHT - this.height;
      this.vy = 0;
      this.land();
    }

    // Update state
    this.updateState(input);

    // Update squash/stretch
    this.updateSquash(dt);

    // Update idle timer
    this.idleTimer += dt;

    // Update blink
    this.updateBlink(dt);

    // Color transition
    if (this.colorTransition < 1) {
      this.colorTransition = Math.min(1, this.colorTransition + dt * 3);
      if (this.colorTransition >= 1) {
        this.color = this.targetColor;
      }
    }

    // Landing timer
    if (this.landingTimer > 0) {
      this.landingTimer -= dt;
    }
  }

  private updateState(input: InputState): void {
    if (input.down && this.isGrounded) {
      this.state = 'ducking';
    } else if (!this.isGrounded && this.vy < 0) {
      this.state = 'jumping';
    } else if (!this.isGrounded && this.vy >= 0) {
      this.state = 'falling';
    } else if (this.landingTimer > 0) {
      this.state = 'landing';
    } else if (Math.abs(this.vx) > 10) {
      this.state = 'running';
    } else {
      this.state = 'idle';
    }
  }

  land(): void {
    this.isGrounded = true;
    this.isJumping = false;
    this.landingTimer = 0.15;
    // Squash on land
    this.applySquash(1.3, 0.7);
  }

  private applySquash(sx: number, sy: number): void {
    this.squashX = sx;
    this.squashY = sy;
    this.squashTimer = 0;
  }

  private updateSquash(dt: number): void {
    this.squashTimer += dt * 8;
    const t = Math.min(this.squashTimer, 1);
    this.squashX = this.squashX + (1 - this.squashX) * t;
    this.squashY = this.squashY + (1 - this.squashY) * t;
  }

  private updateBlink(dt: number): void {
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0) {
      if (this.isBlinking) {
        this.isBlinking = false;
        this.blinkTimer = 2 + Math.random() * 4;
      } else {
        this.isBlinking = true;
        this.blinkTimer = 0.1;
      }
    }
  }

  setColor(color: PaintColor): void {
    this.targetColor = color;
    this.colorTransition = 0;
  }

  addAccessory(name: AccessoryName): void {
    this.accessories.add(name);
  }

  reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.prevY = y;
    this.vx = 0;
    this.vy = 0;
    this.state = 'idle';
    this.facingRight = true;
    this.isGrounded = false;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.isJumping = false;
    this.squashX = 1;
    this.squashY = 1;
    this.color = 'white';
    this.targetColor = 'white';
    this.colorTransition = 1;
    this.accessories.clear();
    this.landingTimer = 0;
    this.idleTimer = 0;
  }
}
