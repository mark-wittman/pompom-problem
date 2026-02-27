import { InputState } from '@/types';
import { PomPom } from '@/entities/PomPom';
import { Platform } from '@/entities/Platform';
import { Collectible } from '@/entities/Collectible';
import { Camera } from './Camera';
import { ParticleSystem } from './ParticleSystem';
import { oneWayPlatformCollision } from './Collision';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, COLLECTIBLE_SIZE } from './Physics';
import { BackgroundRenderer } from '@/rendering/BackgroundRenderer';
import { PlatformRenderer } from '@/rendering/PlatformRenderer';
import { PomPomRenderer } from '@/rendering/PomPomRenderer';
import { CollectibleRenderer } from '@/rendering/CollectibleRenderer';
import { handDrawn } from '@/rendering/HandDrawnRenderer';
import { PLATFORMS, COLLECTIBLES, SPAWN_X, SPAWN_Y, SUMMIT_Y } from '@/level/LevelData';
import { PALETTE } from '@/utils/color';

export class Game {
  pom: PomPom;
  platforms: Platform[];
  collectibles: Collectible[];
  camera: Camera;
  particles: ParticleSystem;

  // Renderers
  bgRenderer: BackgroundRenderer;
  platformRenderer: PlatformRenderer;
  pomRenderer: PomPomRenderer;
  collectibleRenderer: CollectibleRenderer;

  // Game state
  elapsedTime: number = 0;
  reachedSummit: boolean = false;
  isRunning: boolean = false;
  lastSafeX: number = SPAWN_X;
  lastSafeY: number = SPAWN_Y;
  respawnTimer: number = 0;
  isRespawning: boolean = false;

  // Callbacks
  onCollectPaint?: (color: string) => void;
  onCollectAccessory?: (name: string) => void;
  onReachSummit?: () => void;

  constructor() {
    this.pom = new PomPom(SPAWN_X, SPAWN_Y);
    this.platforms = PLATFORMS.map((d) => new Platform(d));
    this.collectibles = COLLECTIBLES.map((d) => new Collectible(d));
    this.camera = new Camera();
    this.particles = new ParticleSystem();

    this.bgRenderer = new BackgroundRenderer();
    this.platformRenderer = new PlatformRenderer();
    this.pomRenderer = new PomPomRenderer();
    this.collectibleRenderer = new CollectibleRenderer();
  }

  init(canvas: HTMLCanvasElement): void {
    handDrawn.init(canvas);
    this.reset();
  }

  reset(): void {
    this.pom.reset(SPAWN_X, SPAWN_Y);
    this.platforms.forEach((p) => p.reset());
    this.collectibles.forEach((c) => c.reset());
    this.camera.reset();
    this.particles.clear();
    this.elapsedTime = 0;
    this.reachedSummit = false;
    this.isRunning = true;
    this.lastSafeX = SPAWN_X;
    this.lastSafeY = SPAWN_Y;
    this.respawnTimer = 0;
    this.isRespawning = false;
  }

  update(input: InputState, dt: number): void {
    if (!this.isRunning) return;

    this.elapsedTime += dt;

    // Update entities
    this.pom.update(input, dt);
    this.platforms.forEach((p) => p.update(dt));
    this.collectibles.forEach((c) => c.update(dt));
    this.particles.update(dt);

    // Platform collision
    const wasGrounded = this.pom.isGrounded;
    this.pom.isGrounded = false;

    const playerAABB = {
      x: this.pom.x,
      y: this.pom.y,
      width: this.pom.width,
      height: this.pom.height,
    };

    for (const platform of this.platforms) {
      if (platform.isGone) continue;

      const pushUp = oneWayPlatformCollision(
        playerAABB,
        this.pom.vy,
        this.pom.prevY,
        platform.aabb
      );

      if (pushUp > 0) {
        this.pom.y -= pushUp;
        this.pom.vy = 0;

        if (!wasGrounded) {
          this.pom.land();
          this.particles.emitDust(this.pom.centerX, this.pom.bottom);
          this.camera.shake(2, 0.08);
        }

        this.pom.isGrounded = true;

        // If on a moving platform, inherit horizontal movement
        if (platform.type === 'moving' && platform.moveAxis === 'x') {
          const prevX = platform.originX + Math.sin(platform.moveTimer - dt * platform.moveSpeed) * platform.moveRange;
          this.pom.x += platform.x - prevX;
        }

        // Trigger crumble
        if (platform.type === 'crumbly') {
          platform.triggerCrumble();
        }
      }
    }

    // Collectible collision
    for (const collectible of this.collectibles) {
      if (collectible.collected) continue;

      // Simple distance check
      const dx = this.pom.centerX - collectible.x;
      const dy = this.pom.centerY - collectible.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < (PLAYER_WIDTH / 2 + COLLECTIBLE_SIZE / 2) * 0.8) {
        collectible.collect();

        if (collectible.type === 'paint' && collectible.paintColor) {
          this.pom.setColor(collectible.paintColor);
          this.particles.emitSplatter(
            collectible.x,
            collectible.y,
            PALETTE[collectible.paintColor]
          );
          this.camera.shake(4, 0.15);
          this.onCollectPaint?.(collectible.paintColor);
        } else if (collectible.type === 'accessory' && collectible.accessoryName) {
          this.pom.addAccessory(collectible.accessoryName);
          this.particles.emitSparkle(collectible.x, collectible.y, '#FFD700');
          this.camera.shake(3, 0.1);
          this.onCollectAccessory?.(collectible.accessoryName);
        }
      }
    }

    // Save last safe position when grounded
    if (this.pom.isGrounded) {
      this.lastSafeX = this.pom.x;
      this.lastSafeY = this.pom.y;
    }

    // Camera
    this.camera.update(this.pom.y, dt);

    // Fall off screen detection — respawn if player is below camera view
    if (this.pom.y > this.camera.y + CANVAS_HEIGHT + 100) {
      if (!this.isRespawning) {
        this.isRespawning = true;
        this.respawnTimer = 0.5; // Brief delay before respawn
      }
    }

    // Handle respawn timer
    if (this.isRespawning) {
      this.respawnTimer -= dt;
      if (this.respawnTimer <= 0) {
        this.pom.x = this.lastSafeX;
        this.pom.y = this.lastSafeY - 20; // Slightly above the platform
        this.pom.vx = 0;
        this.pom.vy = 0;
        this.pom.isGrounded = false;
        this.pom.isJumping = false;
        this.isRespawning = false;
      }
    }

    // Check summit
    if (!this.reachedSummit && this.pom.y < SUMMIT_Y) {
      this.reachedSummit = true;
      this.isRunning = false;
      this.onReachSummit?.();
    }
  }

  render(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.save();

    // Clear
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Apply camera shake
    ctx.translate(this.camera.shakeX, this.camera.shakeY);

    // Background
    this.bgRenderer.render(ctx, this.camera.y);

    // Platforms (only visible ones)
    for (const platform of this.platforms) {
      if (this.camera.isVisible(platform.y, 20)) {
        this.platformRenderer.render(ctx, platform, this.camera.y);
      }
    }

    // Collectibles (only visible ones)
    for (const collectible of this.collectibles) {
      if (!collectible.collected && this.camera.isVisible(collectible.y, COLLECTIBLE_SIZE)) {
        this.collectibleRenderer.render(ctx, collectible, this.camera.y, time);
      }
    }

    // Player
    this.pomRenderer.render(ctx, this.pom, this.camera.y, time);

    // Particles
    this.particles.render(ctx, this.camera.y);

    ctx.restore();
  }
}
