import { PomPom } from '@/entities/PomPom';
import { AccessoryName, PaintColor } from '@/types';
import { PLAYER_RENDER_SIZE } from '@/engine/Physics';
import { PALETTE, PALETTE_DARK, PALETTE_LIGHT, PENCIL_GRAY } from '@/utils/color';
import { randomRange } from '@/utils/math';

export class PomPomRenderer {
  // Pre-computed fuzz line angles (consistent per frame via seed)
  private fuzzAngles: number[] = [];
  private fuzzLengths: number[] = [];
  private dotPositions: { angle: number; dist: number }[] = [];

  constructor() {
    // Generate static fuzz pattern
    for (let i = 0; i < 24; i++) {
      this.fuzzAngles.push((i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.3);
      this.fuzzLengths.push(PLAYER_RENDER_SIZE / 2 + randomRange(4, 12));
    }
    // Generate floating dot positions
    for (let i = 0; i < 12; i++) {
      this.dotPositions.push({
        angle: Math.random() * Math.PI * 2,
        dist: randomRange(PLAYER_RENDER_SIZE / 2 + 2, PLAYER_RENDER_SIZE / 2 + 14),
      });
    }
  }

  render(ctx: CanvasRenderingContext2D, pom: PomPom, cameraY: number, time: number): void {
    const screenY = pom.centerY - cameraY;
    const cx = pom.centerX;
    const cy = screenY;

    ctx.save();
    ctx.translate(cx, cy);

    // Apply squash/stretch
    ctx.scale(pom.squashX, pom.squashY);

    // Idle sway
    if (pom.state === 'idle') {
      const sway = Math.sin(time * 2) * 0.03;
      ctx.rotate(sway);
    }

    const color = pom.colorTransition < 1 ? pom.targetColor : pom.color;
    const mainColor = PALETTE[color];
    const darkColor = PALETTE_DARK[color];
    const lightColor = PALETTE_LIGHT[color];
    const radius = PLAYER_RENDER_SIZE / 2;

    // === Layer 1: Floating dot particles (firework effect) ===
    this.renderFloatingDots(ctx, mainColor, darkColor, time);

    // === Layer 2: Fuzz/radiating lines ===
    this.renderFuzzLines(ctx, darkColor, radius, time);

    // === Layer 3: Main fluffy body (gradient circle) ===
    this.renderBody(ctx, mainColor, lightColor, darkColor, radius);

    // === Layer 4: Face ===
    this.renderFace(ctx, pom, radius);

    // === Layer 5: Stick limbs ===
    this.renderLimbs(ctx, pom, radius);

    // === Layer 6: Accessories ===
    this.renderAccessories(ctx, pom, radius);

    ctx.restore();
  }

  // Large portrait version for photo booth
  renderPortrait(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    color: PaintColor,
    accessories: AccessoryName[],
    time: number
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const mainColor = PALETTE[color];
    const darkColor = PALETTE_DARK[color];
    const lightColor = PALETTE_LIGHT[color];
    const radius = PLAYER_RENDER_SIZE / 2;

    this.renderFloatingDots(ctx, mainColor, darkColor, time);
    this.renderFuzzLines(ctx, darkColor, radius, time);
    this.renderBody(ctx, mainColor, lightColor, darkColor, radius);

    // Happy face for portrait
    // Eyes
    ctx.fillStyle = PENCIL_GRAY;
    ctx.beginPath();
    ctx.ellipse(-8, -4, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -4, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlights
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-6, -6, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -6, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Big smile
    ctx.strokeStyle = PENCIL_GRAY;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 2, 8, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Render each accessory
    const mockPom = { facingRight: true, accessories: new Set(accessories), state: 'idle' } as PomPom;
    this.renderAccessories(ctx, mockPom, radius);

    ctx.restore();
  }

  private renderFloatingDots(
    ctx: CanvasRenderingContext2D,
    mainColor: string,
    darkColor: string,
    time: number
  ): void {
    ctx.fillStyle = darkColor;
    ctx.globalAlpha = 0.5;
    for (const dot of this.dotPositions) {
      const angle = dot.angle + time * 0.5;
      const dist = dot.dist + Math.sin(time * 3 + dot.angle) * 3;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const size = 1.5 + Math.sin(time * 2 + dot.angle * 2) * 0.8;
      ctx.beginPath();
      ctx.arc(dx, dy, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private renderFuzzLines(
    ctx: CanvasRenderingContext2D,
    darkColor: string,
    radius: number,
    time: number
  ): void {
    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.4;

    for (let i = 0; i < this.fuzzAngles.length; i++) {
      const angle = this.fuzzAngles[i] + Math.sin(time * 1.5 + i) * 0.05;
      const innerR = radius - 4;
      const outerR = this.fuzzLengths[i] + Math.sin(time * 2 + i * 0.7) * 2;
      const x1 = Math.cos(angle) * innerR;
      const y1 = Math.sin(angle) * innerR;
      const x2 = Math.cos(angle) * outerR;
      const y2 = Math.sin(angle) * outerR;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  private renderBody(
    ctx: CanvasRenderingContext2D,
    mainColor: string,
    lightColor: string,
    darkColor: string,
    radius: number
  ): void {
    // Radial gradient for fluffy 3D feel
    const grad = ctx.createRadialGradient(-4, -4, 0, 0, 0, radius);
    grad.addColorStop(0, lightColor);
    grad.addColorStop(0.6, mainColor);
    grad.addColorStop(1, darkColor);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle pencil outline
    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Fluffy texture - small arcs around the edge
    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const bx = Math.cos(a) * (radius - 3);
      const by = Math.sin(a) * (radius - 3);
      ctx.beginPath();
      ctx.arc(bx, by, 4, a - 0.5, a + 0.5);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  private renderFace(ctx: CanvasRenderingContext2D, pom: PomPom, radius: number): void {
    const faceDir = pom.facingRight ? 1 : -1;
    const faceOffset = faceDir * 2;

    // Eyes
    if (pom.isBlinking) {
      // Closed eyes (lines)
      ctx.strokeStyle = PENCIL_GRAY;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(faceOffset - 10, -4);
      ctx.lineTo(faceOffset - 4, -4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(faceOffset + 4, -4);
      ctx.lineTo(faceOffset + 10, -4);
      ctx.stroke();
    } else {
      // Open eyes
      ctx.fillStyle = PENCIL_GRAY;
      // Left eye
      ctx.beginPath();
      ctx.ellipse(faceOffset - 7, -4, 3.5, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Right eye
      ctx.beginPath();
      ctx.ellipse(faceOffset + 7, -4, 3.5, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eye highlights
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(faceOffset - 5.5, -6, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(faceOffset + 8.5, -6, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mouth
    ctx.strokeStyle = PENCIL_GRAY;
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';

    if (pom.state === 'jumping') {
      // Open mouth (excited)
      ctx.beginPath();
      ctx.arc(faceOffset, 6, 4, 0, Math.PI);
      ctx.stroke();
    } else if (pom.state === 'falling') {
      // O mouth (surprised)
      ctx.beginPath();
      ctx.ellipse(faceOffset, 6, 3, 4, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Gentle smile
      ctx.beginPath();
      ctx.arc(faceOffset, 4, 5, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
  }

  private renderLimbs(ctx: CanvasRenderingContext2D, pom: PomPom, radius: number): void {
    // Cute little feet only (no arms)
    const feetSpread = 6;
    const footY = radius - 2;
    const walkBob = pom.state === 'running' ? Math.sin(pom.idleTimer * 12) * 3 : 0;

    ctx.fillStyle = PENCIL_GRAY;
    // Left foot
    ctx.beginPath();
    ctx.ellipse(-feetSpread, footY + walkBob, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Right foot
    ctx.beginPath();
    ctx.ellipse(feetSpread, footY - walkBob, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  renderAccessories(ctx: CanvasRenderingContext2D, pom: PomPom, radius: number): void {
    for (const acc of pom.accessories) {
      this.renderAccessory(ctx, acc, radius, pom.facingRight);
    }
  }

  private renderAccessory(
    ctx: CanvasRenderingContext2D,
    name: AccessoryName,
    radius: number,
    facingRight: boolean
  ): void {
    ctx.save();
    const dir = facingRight ? 1 : -1;

    switch (name) {
      case 'sunglasses':
        this.drawSunglasses(ctx, dir);
        break;
      case 'bow':
        this.drawBow(ctx, radius);
        break;
      case 'crown':
        this.drawCrown(ctx, radius);
        break;
      case 'tophat':
        this.drawTopHat(ctx, radius);
        break;
      case 'flower':
        this.drawFlower(ctx, radius);
        break;
      case 'star':
        this.drawStar(ctx, radius);
        break;
      case 'mustache':
        this.drawMustache(ctx, dir);
        break;
      case 'cape':
        this.drawCape(ctx, radius, dir);
        break;
      case 'partyhat':
        this.drawPartyHat(ctx, radius);
        break;
      case 'wings':
        this.drawWings(ctx, radius);
        break;
    }

    ctx.restore();
  }

  private drawSunglasses(ctx: CanvasRenderingContext2D, dir: number): void {
    const faceOffset = dir * 2;
    ctx.fillStyle = '#2A2A2A';
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 1.5;
    // Left lens
    ctx.beginPath();
    ctx.roundRect(faceOffset - 13, -8, 10, 7, 2);
    ctx.fill();
    ctx.stroke();
    // Right lens
    ctx.beginPath();
    ctx.roundRect(faceOffset + 3, -8, 10, 7, 2);
    ctx.fill();
    ctx.stroke();
    // Bridge
    ctx.beginPath();
    ctx.moveTo(faceOffset - 3, -5);
    ctx.lineTo(faceOffset + 3, -5);
    ctx.stroke();
  }

  private drawBow(ctx: CanvasRenderingContext2D, radius: number): void {
    ctx.fillStyle = '#E84080';
    ctx.strokeStyle = '#C02060';
    ctx.lineWidth = 1;
    const bx = 12;
    const by = -radius + 4;
    // Left loop
    ctx.beginPath();
    ctx.ellipse(bx - 6, by, 6, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Right loop
    ctx.beginPath();
    ctx.ellipse(bx + 6, by, 6, 4, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Center knot
    ctx.fillStyle = '#C02060';
    ctx.beginPath();
    ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawCrown(ctx: CanvasRenderingContext2D, radius: number): void {
    const cy = -radius - 2;
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-12, cy + 10);
    ctx.lineTo(-12, cy + 2);
    ctx.lineTo(-7, cy + 6);
    ctx.lineTo(-2, cy);
    ctx.lineTo(3, cy + 6);
    ctx.lineTo(8, cy + 2);
    ctx.lineTo(12, cy + 6);
    ctx.lineTo(12, cy + 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Jewels
    ctx.fillStyle = '#E84040';
    ctx.beginPath();
    ctx.arc(-2, cy + 6, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawTopHat(ctx: CanvasRenderingContext2D, radius: number): void {
    const hy = -radius - 2;
    ctx.fillStyle = '#2A2A2A';
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 1.2;
    // Brim
    ctx.beginPath();
    ctx.ellipse(0, hy + 8, 18, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Top
    ctx.fillRect(-10, hy - 12, 20, 20);
    ctx.strokeRect(-10, hy - 12, 20, 20);
    // Band
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(-10, hy + 2, 20, 4);
  }

  private drawFlower(ctx: CanvasRenderingContext2D, radius: number): void {
    const fx = -14;
    const fy = -radius + 2;
    // Petals
    ctx.fillStyle = '#FF69B4';
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(
        fx + Math.cos(angle) * 5,
        fy + Math.sin(angle) * 5,
        4,
        3,
        angle,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    // Center
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(fx, fy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawStar(ctx: CanvasRenderingContext2D, radius: number): void {
    const sx = 0;
    const sy = -radius - 8;
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const outerR = 8;
      const innerR = 3;
      ctx.lineTo(sx + Math.cos(angle) * outerR, sy + Math.sin(angle) * outerR);
      const innerAngle = angle + Math.PI / 5;
      ctx.lineTo(sx + Math.cos(innerAngle) * innerR, sy + Math.sin(innerAngle) * innerR);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  private drawMustache(ctx: CanvasRenderingContext2D, dir: number): void {
    const faceOffset = dir * 2;
    ctx.fillStyle = '#3A2A1A';
    ctx.beginPath();
    ctx.moveTo(faceOffset, 8);
    // Left curl
    ctx.bezierCurveTo(faceOffset - 4, 6, faceOffset - 10, 4, faceOffset - 14, 6);
    ctx.bezierCurveTo(faceOffset - 10, 8, faceOffset - 4, 10, faceOffset, 10);
    // Right curl
    ctx.bezierCurveTo(faceOffset + 4, 10, faceOffset + 10, 8, faceOffset + 14, 6);
    ctx.bezierCurveTo(faceOffset + 10, 4, faceOffset + 4, 6, faceOffset, 8);
    ctx.fill();
  }

  private drawCape(ctx: CanvasRenderingContext2D, radius: number, dir: number): void {
    ctx.fillStyle = '#8B0000';
    ctx.strokeStyle = '#5A0000';
    ctx.lineWidth = 1;
    const capeDir = -dir;
    ctx.beginPath();
    ctx.moveTo(capeDir * 2, -radius + 5);
    ctx.quadraticCurveTo(capeDir * 20, 0, capeDir * 18, radius + 12);
    ctx.lineTo(capeDir * 4, radius + 4);
    ctx.quadraticCurveTo(capeDir * 8, 0, capeDir * 2, -radius + 5);
    ctx.fill();
    ctx.stroke();
    // Cape clasp
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(capeDir * 2, -radius + 5, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawPartyHat(ctx: CanvasRenderingContext2D, radius: number): void {
    const hy = -radius;
    ctx.fillStyle = '#E84080';
    ctx.strokeStyle = '#C02060';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-10, hy + 4);
    ctx.lineTo(0, hy - 18);
    ctx.lineTo(10, hy + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Stripes
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-6, hy);
    ctx.lineTo(0, hy - 14);
    ctx.lineTo(6, hy);
    ctx.stroke();
    // Pom on top
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, hy - 18, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawWings(ctx: CanvasRenderingContext2D, radius: number): void {
    // Rainbow gradient wings
    const colors = ['#FF6B6B', '#FFA500', '#FFD700', '#7EBD73', '#5B8DBE', '#9B72CF'];
    ctx.globalAlpha = 0.7;
    // Left wing
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = colors[i];
      const angle = Math.PI * 0.7 + (i / 6) * 0.4;
      const len = 20 - i * 2;
      ctx.beginPath();
      const sx = Math.cos(angle) * radius;
      const sy = Math.sin(angle) * (radius - 5);
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(
        sx - len * 1.5,
        sy - len * 0.3,
        sx - len,
        sy + len * 0.5
      );
      ctx.lineTo(sx, sy);
      ctx.fill();
    }
    // Right wing (mirrored)
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = colors[i];
      const angle = Math.PI * 0.3 - (i / 6) * 0.4;
      const len = 20 - i * 2;
      ctx.beginPath();
      const sx = Math.cos(angle) * radius;
      const sy = Math.sin(angle) * (radius - 5);
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(
        sx + len * 1.5,
        sy - len * 0.3,
        sx + len,
        sy + len * 0.5
      );
      ctx.lineTo(sx, sy);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
