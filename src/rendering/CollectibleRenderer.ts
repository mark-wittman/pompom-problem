import { Collectible } from '@/entities/Collectible';
import { handDrawn, HandDrawnRenderer } from './HandDrawnRenderer';
import { COLLECTIBLE_SIZE } from '@/engine/Physics';
import { PALETTE, PALETTE_DARK, PENCIL_GRAY } from '@/utils/color';

export class CollectibleRenderer {
  render(ctx: CanvasRenderingContext2D, collectible: Collectible, cameraY: number, time: number): void {
    if (collectible.collected) return;

    const screenY = collectible.y - cameraY;
    const x = collectible.x;
    const size = COLLECTIBLE_SIZE;

    ctx.save();
    ctx.translate(x, screenY);

    // Gentle rotation
    const rot = Math.sin(time * 1.5 + collectible.seed) * 0.08;
    ctx.rotate(rot);

    // Glow effect
    ctx.globalAlpha = 0.15 + Math.sin(time * 3 + collectible.seed) * 0.05;
    ctx.fillStyle = collectible.type === 'paint'
      ? PALETTE[collectible.paintColor!]
      : '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (collectible.type === 'paint') {
      this.renderPaintBucket(ctx, collectible, size);
    } else {
      this.renderAccessoryPickup(ctx, collectible, size, time);
    }

    ctx.restore();
  }

  private renderPaintBucket(ctx: CanvasRenderingContext2D, collectible: Collectible, size: number): void {
    const color = PALETTE[collectible.paintColor!];
    const darkColor = PALETTE_DARK[collectible.paintColor!];
    const halfSize = size / 2;

    // Bucket body
    handDrawn.rectangle(ctx, -halfSize + 2, -halfSize + 4, size - 4, size - 6, {
      ...HandDrawnRenderer.PAINT_BUCKET,
      fill: '#D4D4D4',
      seed: collectible.seed,
    });

    // Paint dripping over edge
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-halfSize + 4, -halfSize + 4);
    ctx.lineTo(halfSize - 4, -halfSize + 4);
    ctx.lineTo(halfSize - 4, -halfSize + 8);
    // Drip on right
    ctx.quadraticCurveTo(halfSize - 2, -halfSize + 14, halfSize - 6, -halfSize + 12);
    ctx.lineTo(-halfSize + 6, -halfSize + 8);
    // Drip on left
    ctx.quadraticCurveTo(-halfSize + 2, -halfSize + 16, -halfSize + 4, -halfSize + 8);
    ctx.closePath();
    ctx.fill();

    // Outline
    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Handle
    ctx.strokeStyle = PENCIL_GRAY;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -halfSize + 2, 8, Math.PI + 0.3, -0.3);
    ctx.stroke();
  }

  private renderAccessoryPickup(ctx: CanvasRenderingContext2D, collectible: Collectible, size: number, time: number): void {
    const halfSize = size / 2;

    // Gift box style
    handDrawn.rectangle(ctx, -halfSize + 2, -halfSize + 6, size - 4, size - 8, {
      ...HandDrawnRenderer.ACCESSORY,
      fill: '#FFE4B5',
      seed: collectible.seed,
    });

    // Ribbon cross
    ctx.strokeStyle = '#E84080';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -halfSize + 6);
    ctx.lineTo(0, halfSize - 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-halfSize + 2, 0);
    ctx.lineTo(halfSize - 2, 0);
    ctx.stroke();

    // Bow on top
    ctx.fillStyle = '#E84080';
    ctx.beginPath();
    ctx.ellipse(-4, -halfSize + 6, 5, 3, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -halfSize + 6, 5, 3, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Question mark (what's inside?)
    ctx.fillStyle = PENCIL_GRAY;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 0, 2);

    // Sparkle stars around it
    const sparkleAlpha = 0.3 + Math.sin(time * 4) * 0.2;
    ctx.globalAlpha = sparkleAlpha;
    ctx.fillStyle = '#FFD700';
    this.drawTinyStar(ctx, -halfSize - 4, -halfSize, 3);
    this.drawTinyStar(ctx, halfSize + 2, -4, 2.5);
    this.drawTinyStar(ctx, -2, halfSize + 2, 2);
    ctx.globalAlpha = 1;
  }

  private drawTinyStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
    }
    ctx.stroke();
  }
}
