import { PaintColor } from '@/types';

// Hand-drawn palette - slightly muted, pencil-like colors
export const PALETTE: Record<PaintColor, string> = {
  white: '#F5F0E8',
  blue: '#5B8DBE',
  pink: '#E8829B',
  green: '#7EBD73',
  orange: '#E8A34E',
  purple: '#9B72CF',
  yellow: '#E8D44E',
};

// Darker variants for outlines
export const PALETTE_DARK: Record<PaintColor, string> = {
  white: '#C4BFB3',
  blue: '#3A6B9B',
  pink: '#C4607A',
  green: '#5C9B51',
  orange: '#C4813A',
  purple: '#7B52AF',
  yellow: '#C4B23A',
};

// Lighter variants for highlights
export const PALETTE_LIGHT: Record<PaintColor, string> = {
  white: '#FFFEF8',
  blue: '#8BB8E0',
  pink: '#F0ADC0',
  green: '#A8DCA0',
  orange: '#F0C488',
  purple: '#BEA0E0',
  yellow: '#F0E888',
};

// Background colors
export const BG_CREAM = '#FDF6E3';
export const BG_PAPER_LINES = '#E8E0D0';
export const PENCIL_GRAY = '#4A4A4A';
export const PENCIL_LIGHT = '#8A8A7A';

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
}

export function blendColors(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  return rgbToHex(
    c1.r + (c2.r - c1.r) * t,
    c1.g + (c2.g - c1.g) * t,
    c1.b + (c2.b - c1.b) * t
  );
}
