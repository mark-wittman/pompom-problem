import { Platform } from '@/entities/Platform';
import { handDrawn, HandDrawnRenderer } from './HandDrawnRenderer';
import { PLATFORM_HEIGHT } from '@/engine/Physics';
import { PENCIL_GRAY } from '@/utils/color';

export class PlatformRenderer {
  render(ctx: CanvasRenderingContext2D, platform: Platform, cameraY: number): void {
    if (platform.isGone) return;

    const screenY = platform.y - cameraY;
    const x = platform.x + (platform.isCrumbling ? platform.shakeOffset : 0);

    ctx.save();

    // Crumbling platforms fade out
    if (platform.isCrumbling) {
      ctx.globalAlpha = 1 - platform.crumbleTimer / platform.crumbleDuration;
    }

    // Choose style based on type
    let options;
    switch (platform.type) {
      case 'crumbly':
        options = { ...HandDrawnRenderer.CRUMBLY_PLANK, seed: platform.seed };
        break;
      case 'moving':
        options = { ...HandDrawnRenderer.MOVING_PLANK, seed: platform.seed };
        break;
      default:
        options = { ...HandDrawnRenderer.WOOD_PLANK, seed: platform.seed };
    }

    // Draw the plank with Rough.js
    handDrawn.rectangle(ctx, x, screenY, platform.width, PLATFORM_HEIGHT, options);

    // Add wood grain details (small lines on top)
    ctx.strokeStyle = PENCIL_GRAY;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = (platform.isCrumbling ? (1 - platform.crumbleTimer / platform.crumbleDuration) : 1) * 0.2;

    const grainCount = Math.floor(platform.width / 20);
    for (let i = 0; i < grainCount; i++) {
      // Use seed for deterministic placement
      const gx = x + ((platform.seed * (i + 1) * 7) % platform.width);
      const gy = screenY + 3 + ((platform.seed * (i + 1) * 13) % (PLATFORM_HEIGHT - 6));
      const gw = 8 + ((platform.seed * (i + 1) * 3) % 12);
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + gw, gy + ((platform.seed * i) % 3) - 1);
      ctx.stroke();
    }

    // Moving platform indicator - small arrows
    if (platform.type === 'moving') {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#4A6B80';
      const arrowY = screenY + PLATFORM_HEIGHT / 2;
      // Left arrow
      ctx.beginPath();
      ctx.moveTo(x + 8, arrowY);
      ctx.lineTo(x + 14, arrowY - 4);
      ctx.lineTo(x + 14, arrowY + 4);
      ctx.fill();
      // Right arrow
      ctx.beginPath();
      ctx.moveTo(x + platform.width - 8, arrowY);
      ctx.lineTo(x + platform.width - 14, arrowY - 4);
      ctx.lineTo(x + platform.width - 14, arrowY + 4);
      ctx.fill();
    }

    // Crumbly platform - crack lines
    if (platform.type === 'crumbly') {
      ctx.strokeStyle = '#5A4A30';
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.4;
      // Diagonal cracks
      const cx = x + platform.width * 0.3;
      ctx.beginPath();
      ctx.moveTo(cx, screenY);
      ctx.lineTo(cx + 5, screenY + PLATFORM_HEIGHT * 0.6);
      ctx.lineTo(cx - 3, screenY + PLATFORM_HEIGHT);
      ctx.stroke();

      const cx2 = x + platform.width * 0.7;
      ctx.beginPath();
      ctx.moveTo(cx2, screenY + 2);
      ctx.lineTo(cx2 - 4, screenY + PLATFORM_HEIGHT * 0.5);
      ctx.lineTo(cx2 + 2, screenY + PLATFORM_HEIGHT - 1);
      ctx.stroke();
    }

    ctx.restore();
  }
}
