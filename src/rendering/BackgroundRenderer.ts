import { BG_CREAM, BG_PAPER_LINES } from '@/utils/color';
import { CANVAS_WIDTH, CANVAS_HEIGHT, LEVEL_HEIGHT } from '@/engine/Physics';

export class BackgroundRenderer {
  // Render cream paper background with subtle horizontal lines
  render(ctx: CanvasRenderingContext2D, cameraY: number): void {
    // Cream paper background
    ctx.fillStyle = BG_CREAM;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Subtle paper texture - faint horizontal lines (notebook style)
    ctx.strokeStyle = BG_PAPER_LINES;
    ctx.lineWidth = 0.3;
    ctx.globalAlpha = 0.3;

    const lineSpacing = 30;
    const startLine = Math.floor(cameraY / lineSpacing) * lineSpacing;

    for (let y = startLine; y < cameraY + CANVAS_HEIGHT + lineSpacing; y += lineSpacing) {
      const screenY = y - cameraY;
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(CANVAS_WIDTH, screenY);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Subtle margin line on left (red, like a real notebook)
    ctx.strokeStyle = '#E8B0B0';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(40, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Parallax "depth" clouds/doodles - very subtle
    this.renderParallaxDoodles(ctx, cameraY);
  }

  private renderParallaxDoodles(ctx: CanvasRenderingContext2D, cameraY: number): void {
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = '#8A8A7A';

    // Scattered small circles at different parallax depths
    const doodles = [
      { x: 50, worldY: 1000, size: 40, parallax: 0.3 },
      { x: 450, worldY: 2500, size: 35, parallax: 0.2 },
      { x: 100, worldY: 4000, size: 45, parallax: 0.3 },
      { x: 500, worldY: 5500, size: 30, parallax: 0.2 },
      { x: 300, worldY: 6500, size: 50, parallax: 0.3 },
      { x: 150, worldY: 3000, size: 25, parallax: 0.15 },
      { x: 400, worldY: 7000, size: 35, parallax: 0.25 },
    ];

    for (const d of doodles) {
      const screenY = d.worldY - cameraY * d.parallax;
      if (screenY > -60 && screenY < CANVAS_HEIGHT + 60) {
        // Little spirals
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 4; a += 0.2) {
          const r = (a / (Math.PI * 4)) * d.size;
          const px = d.x + Math.cos(a) * r;
          const py = screenY + Math.sin(a) * r;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
  }
}
