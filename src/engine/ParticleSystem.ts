import { Particle } from '@/types';
import { randomRange } from '@/utils/math';

export class ParticleSystem {
  particles: Particle[] = [];

  update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;

      // Gravity for dust particles
      if (p.type === 'dust' || p.type === 'splatter') {
        p.vy += 400 * dt;
      }

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  emit(
    x: number,
    y: number,
    count: number,
    type: Particle['type'],
    color: string,
    config?: {
      speedMin?: number;
      speedMax?: number;
      sizeMin?: number;
      sizeMax?: number;
      lifeMin?: number;
      lifeMax?: number;
      angleMin?: number;
      angleMax?: number;
    }
  ): void {
    const {
      speedMin = 30,
      speedMax = 120,
      sizeMin = 2,
      sizeMax = 5,
      lifeMin = 0.2,
      lifeMax = 0.6,
      angleMin = 0,
      angleMax = Math.PI * 2,
    } = config || {};

    for (let i = 0; i < count; i++) {
      const angle = randomRange(angleMin, angleMax);
      const speed = randomRange(speedMin, speedMax);
      const life = randomRange(lifeMin, lifeMax);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        size: randomRange(sizeMin, sizeMax),
        color,
        type,
      });
    }
  }

  emitDust(x: number, y: number, color: string = '#C4BFB3'): void {
    this.emit(x, y, 6, 'dust', color, {
      speedMin: 20,
      speedMax: 80,
      sizeMin: 2,
      sizeMax: 4,
      lifeMin: 0.2,
      lifeMax: 0.5,
      angleMin: -Math.PI,
      angleMax: 0,
    });
  }

  emitSparkle(x: number, y: number, color: string): void {
    this.emit(x, y, 8, 'sparkle', color, {
      speedMin: 40,
      speedMax: 150,
      sizeMin: 2,
      sizeMax: 6,
      lifeMin: 0.3,
      lifeMax: 0.7,
    });
  }

  emitSplatter(x: number, y: number, color: string): void {
    this.emit(x, y, 12, 'splatter', color, {
      speedMin: 60,
      speedMax: 200,
      sizeMin: 3,
      sizeMax: 8,
      lifeMin: 0.4,
      lifeMax: 0.8,
    });
  }

  render(ctx: CanvasRenderingContext2D, cameraY: number): void {
    for (const p of this.particles) {
      const screenY = p.y - cameraY;
      const alpha = p.life / p.maxLife;

      ctx.save();
      ctx.globalAlpha = alpha;

      if (p.type === 'sparkle') {
        // Star sparkle
        ctx.fillStyle = p.color;
        ctx.translate(p.x, screenY);
        ctx.rotate((p.life / p.maxLife) * Math.PI * 2);
        const s = p.size * (0.5 + alpha * 0.5);
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-s / 2, -s / 2, s, s);
      } else {
        // Circle particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  clear(): void {
    this.particles = [];
  }
}
