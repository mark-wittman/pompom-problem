'use client';

import { useRef, useEffect, useState } from 'react';
import { useGameStore } from '@/state/gameStore';
import { PomPomRenderer } from '@/rendering/PomPomRenderer';
import { AccessoryName, PaintColor } from '@/types';
import { PALETTE } from '@/utils/color';

const ALL_ACCESSORIES: AccessoryName[] = [
  'sunglasses', 'bow', 'crown', 'tophat', 'flower',
  'star', 'mustache', 'cape', 'partyhat', 'wings',
];

const ALL_COLORS: PaintColor[] = ['white', 'blue', 'pink', 'green', 'orange', 'purple', 'yellow'];

const ACCESSORY_LABELS: Record<AccessoryName, string> = {
  sunglasses: 'Shades',
  bow: 'Bow',
  crown: 'Crown',
  tophat: 'Top Hat',
  flower: 'Flower',
  star: 'Star',
  mustache: 'Stache',
  cape: 'Cape',
  partyhat: 'Party Hat',
  wings: 'Wings',
};

export default function DressUp() {
  const { accessories: collected, pomColor, setPhase, setPomColor } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<PomPomRenderer | null>(null);
  const animRef = useRef<number>(0);

  // Local state for mix-and-match
  const [activeAccessories, setActiveAccessories] = useState<AccessoryName[]>([...collected]);
  const [selectedColor, setSelectedColor] = useState<PaintColor>(pomColor);

  const toggleAccessory = (acc: AccessoryName) => {
    setActiveAccessories((prev) =>
      prev.includes(acc) ? prev.filter((a) => a !== acc) : [...prev, acc]
    );
  };

  // Render preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!rendererRef.current) {
      rendererRef.current = new PomPomRenderer();
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 200 * dpr;
    canvas.height = 200 * dpr;
    canvas.style.width = '200px';
    canvas.style.height = '200px';
    ctx.scale(dpr, dpr);

    const render = (time: number) => {
      ctx.clearRect(0, 0, 200, 200);
      ctx.fillStyle = '#FDF6E3';
      ctx.fillRect(0, 0, 200, 200);

      rendererRef.current!.renderPortrait(
        ctx, 100, 100, 2.5,
        selectedColor,
        activeAccessories,
        time / 1000
      );

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [selectedColor, activeAccessories]);

  const handleDone = () => {
    // Update store with final choices
    setPomColor(selectedColor);
    // Store accessories are already set from gameplay; the photo booth
    // will read activeAccessories via a store update
    useGameStore.setState({ accessories: activeAccessories });
    setPhase('photobooth');
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#FDF6E3]/95 overflow-y-auto py-4">
      <div
        className="text-center w-full max-w-sm px-4"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <h2 className="text-2xl mb-3" style={{ color: '#4A4A4A' }}>
          Dress Up!
        </h2>

        {/* Preview */}
        <div className="inline-block rounded-xl overflow-hidden border-2 border-[#E8E0D0] mb-3">
          <canvas ref={canvasRef} />
        </div>

        {/* Color picker */}
        <div className="mb-3">
          <div className="text-sm text-gray-400 mb-1">Color</div>
          <div className="flex justify-center gap-2">
            {ALL_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform ${
                  selectedColor === color ? 'scale-125 border-gray-600' : 'border-gray-300'
                } ${!collected.length && color !== 'white' && !['white'].includes(pomColor) && color !== pomColor ? '' : ''}`}
                style={{ backgroundColor: PALETTE[color] }}
              />
            ))}
          </div>
        </div>

        {/* Accessory toggles */}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">
            Accessories ({activeAccessories.length} on)
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {ALL_ACCESSORIES.map((acc) => {
              const owned = collected.includes(acc);
              const active = activeAccessories.includes(acc);
              return (
                <button
                  key={acc}
                  onClick={() => owned && toggleAccessory(acc)}
                  disabled={!owned}
                  className={`px-2 py-1 text-sm rounded-lg border cursor-pointer transition-all ${
                    !owned
                      ? 'opacity-30 border-gray-300 bg-gray-100 cursor-not-allowed'
                      : active
                      ? 'bg-[#E8829B] border-[#C4607A] text-white scale-105'
                      : 'bg-white border-[#E8E0D0] text-gray-500 hover:border-[#E8829B]'
                  }`}
                  style={{ fontFamily: "'Patrick Hand', cursive" }}
                >
                  {ACCESSORY_LABELS[acc]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Done button */}
        <button
          onClick={handleDone}
          className="px-8 py-2.5 text-xl rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            fontFamily: "'Patrick Hand', cursive",
            backgroundColor: '#7EBD73',
            borderColor: '#5C9B51',
            color: '#FFFFFF',
            boxShadow: '2px 2px 0px #5C9B51',
          }}
        >
          Take Photo!
        </button>
      </div>
    </div>
  );
}
