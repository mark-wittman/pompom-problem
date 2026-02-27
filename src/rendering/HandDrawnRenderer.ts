import rough from 'roughjs';
import type { RoughCanvas } from 'roughjs/bin/canvas';
import type { Options } from 'roughjs/bin/core';

// Singleton Rough.js canvas wrapper with caching
export class HandDrawnRenderer {
  private rc: RoughCanvas | null = null;
  private canvas: HTMLCanvasElement | null = null;

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.rc = rough.canvas(canvas);
  }

  get roughCanvas(): RoughCanvas | null {
    return this.rc;
  }

  // Pre-configured style presets
  static readonly WOOD_PLANK: Options = {
    fill: '#C9A96E',
    fillStyle: 'hachure',
    fillWeight: 1.5,
    hachureGap: 6,
    hachureAngle: 0, // Horizontal grain
    stroke: '#8B7145',
    strokeWidth: 1.5,
    roughness: 1.2,
    bowing: 1,
  };

  static readonly CRUMBLY_PLANK: Options = {
    fill: '#B89860',
    fillStyle: 'hachure',
    fillWeight: 1,
    hachureGap: 8,
    hachureAngle: -10,
    stroke: '#7A6335',
    strokeWidth: 1.2,
    roughness: 2,
    bowing: 2,
  };

  static readonly MOVING_PLANK: Options = {
    fill: '#A8C4D8',
    fillStyle: 'hachure',
    fillWeight: 1.5,
    hachureGap: 5,
    hachureAngle: 45,
    stroke: '#6B8BA4',
    strokeWidth: 1.5,
    roughness: 1,
    bowing: 0.8,
  };

  static readonly PAINT_BUCKET: Options = {
    fillStyle: 'solid',
    stroke: '#4A4A4A',
    strokeWidth: 1.5,
    roughness: 1.5,
    bowing: 1,
  };

  static readonly ACCESSORY: Options = {
    fillStyle: 'solid',
    stroke: '#4A4A4A',
    strokeWidth: 1.2,
    roughness: 1.3,
    bowing: 0.8,
  };

  rectangle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    options?: Options
  ): void {
    if (!this.rc) return;
    const drawable = this.rc.generator.rectangle(x, y, w, h, options);
    this.rc.draw(drawable);
  }

  circle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    diameter: number,
    options?: Options
  ): void {
    if (!this.rc) return;
    const drawable = this.rc.generator.circle(x, y, diameter, options);
    this.rc.draw(drawable);
  }

  ellipse(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    options?: Options
  ): void {
    if (!this.rc) return;
    const drawable = this.rc.generator.ellipse(x, y, w, h, options);
    this.rc.draw(drawable);
  }

  line(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: Options
  ): void {
    if (!this.rc) return;
    const drawable = this.rc.generator.line(x1, y1, x2, y2, options);
    this.rc.draw(drawable);
  }
}

// Export singleton
export const handDrawn = new HandDrawnRenderer();
