import { PlatformData, CollectibleData } from '@/types';
import { LEVEL_WIDTH } from '@/engine/Physics';

// Level 1: ~8000px tall, ~90 platforms, 16 collectibles
// Max jump height with gravity=1400, jumpV=-820 is ~240px
// Tutorial gaps: 80-130px | Main gaps: 120-160px | Climax gaps: 140-200px

const W = LEVEL_WIDTH; // 600
const center = W / 2;

export const PLATFORMS: PlatformData[] = [
  // ===== GROUND / SPAWN AREA =====
  { x: 0, y: 7900, width: W, type: 'normal' }, // Full-width ground

  // ===== TUTORIAL ZONE (y: 6800-7800) - Wide platforms, small gaps =====
  { x: 100, y: 7790, width: 220, type: 'normal' },   // +110 — easy first hop
  { x: 350, y: 7690, width: 200, type: 'normal' },   // +100
  { x: 80, y: 7580, width: 250, type: 'normal' },    // +110
  { x: 300, y: 7470, width: 200, type: 'normal' },   // +110
  { x: 50, y: 7370, width: 200, type: 'normal' },    // +100
  { x: 320, y: 7260, width: 200, type: 'normal' },   // +110
  { x: 100, y: 7140, width: 200, type: 'normal' },   // +120
  { x: 380, y: 7020, width: 180, type: 'normal' },   // +120
  { x: 50, y: 6910, width: 220, type: 'normal' },    // +110
  { x: 300, y: 6800, width: 200, type: 'normal' },   // +110

  // ===== MAIN CHALLENGE - Lower (y: 5800-6800) =====
  { x: 80, y: 6680, width: 170, type: 'normal' },    // +120
  { x: 350, y: 6560, width: 150, type: 'normal' },   // +120
  { x: 100, y: 6430, width: 160, type: 'moving', moveRange: 80, moveSpeed: 1.2, moveAxis: 'x' }, // +130
  { x: 380, y: 6300, width: 140, type: 'normal' },   // +130
  { x: 120, y: 6170, width: 150, type: 'normal' },   // +130
  { x: 350, y: 6040, width: 130, type: 'crumbly' },  // +130
  { x: 50, y: 5920, width: 170, type: 'normal' },    // +120
  { x: 300, y: 5800, width: 150, type: 'normal' },   // +120

  // ===== MAIN CHALLENGE - Middle (y: 4700-5800) =====
  { x: 100, y: 5670, width: 140, type: 'moving', moveRange: 90, moveSpeed: 1.3, moveAxis: 'x' }, // +130
  { x: 380, y: 5540, width: 130, type: 'normal' },   // +130
  { x: 150, y: 5400, width: 140, type: 'normal' },   // +140
  { x: 50, y: 5260, width: 130, type: 'normal' },    // +140
  { x: 350, y: 5120, width: 140, type: 'crumbly' },  // +140
  { x: 120, y: 4990, width: 140, type: 'normal' },   // +130
  { x: 400, y: 4860, width: 130, type: 'moving', moveRange: 70, moveSpeed: 1.4, moveAxis: 'x' }, // +130
  { x: 80, y: 4730, width: 150, type: 'normal' },    // +130

  // ===== MAIN CHALLENGE - Upper (y: 3500-4700) =====
  { x: 320, y: 4590, width: 130, type: 'normal' },   // +140
  { x: 50, y: 4450, width: 140, type: 'crumbly' },   // +140
  { x: 280, y: 4310, width: 140, type: 'normal' },   // +140
  { x: 420, y: 4170, width: 120, type: 'normal' },   // +140
  { x: 100, y: 4030, width: 140, type: 'normal' },   // +140
  { x: 350, y: 3890, width: 130, type: 'moving', moveRange: 90, moveSpeed: 1.5, moveAxis: 'x' }, // +140
  { x: 50, y: 3750, width: 140, type: 'normal' },    // +140
  { x: 300, y: 3610, width: 120, type: 'crumbly' },  // +140
  { x: 130, y: 3470, width: 130, type: 'normal' },   // +140

  // ===== CLIMAX ZONE - Lower (y: 2400-3500) =====
  { x: 380, y: 3320, width: 120, type: 'normal' },   // +150
  { x: 100, y: 3170, width: 120, type: 'moving', moveRange: 80, moveSpeed: 1.6, moveAxis: 'x' }, // +150
  { x: 350, y: 3020, width: 110, type: 'normal' },   // +150
  { x: 50, y: 2870, width: 120, type: 'normal' },    // +150
  { x: 300, y: 2720, width: 100, type: 'crumbly' },  // +150
  { x: 120, y: 2570, width: 120, type: 'normal' },   // +150
  { x: 400, y: 2420, width: 110, type: 'normal' },   // +150

  // ===== CLIMAX ZONE - Middle (y: 1400-2400) =====
  { x: 150, y: 2270, width: 110, type: 'moving', moveRange: 70, moveSpeed: 1.8, moveAxis: 'x' }, // +150
  { x: 380, y: 2110, width: 100, type: 'normal' },   // +160
  { x: 50, y: 1960, width: 110, type: 'normal' },    // +150
  { x: 300, y: 1810, width: 100, type: 'crumbly' },  // +150
  { x: 100, y: 1660, width: 110, type: 'normal' },   // +150
  { x: 380, y: 1510, width: 100, type: 'normal' },   // +150

  // ===== CLIMAX ZONE - Upper (y: 400-1400) =====
  { x: 80, y: 1360, width: 110, type: 'moving', moveRange: 70, moveSpeed: 1.8, moveAxis: 'x' }, // +150
  { x: 320, y: 1200, width: 100, type: 'normal' },   // +160
  { x: 50, y: 1050, width: 100, type: 'crumbly' },   // +150
  { x: 300, y: 900, width: 100, type: 'normal' },    // +150
  { x: 100, y: 750, width: 110, type: 'moving', moveRange: 80, moveSpeed: 2.0, moveAxis: 'x' }, // +150
  { x: 380, y: 600, width: 100, type: 'normal' },    // +150
  { x: 80, y: 450, width: 110, type: 'normal' },     // +150

  // ===== DETOUR PATHS (harder-to-reach side platforms for accessories) =====
  { x: 480, y: 7060, width: 100, type: 'normal' },   // Tutorial detour — flower
  { x: 0, y: 5740, width: 80, type: 'normal' },      // Mid detour — star
  { x: 480, y: 4480, width: 80, type: 'crumbly' },   // Upper detour — mustache
  { x: 500, y: 2000, width: 70, type: 'normal' },    // Climax detour — cape
  { x: 0, y: 1080, width: 70, type: 'crumbly' },     // Hardest detour — wings

  // ===== SUMMIT PLATFORM =====
  { x: center - 150, y: 280, width: 300, type: 'normal' },
];

export const COLLECTIBLES: CollectibleData[] = [
  // ===== PAINT BUCKETS (6 total) - on main path =====
  { x: 200, y: 7540, type: 'paint', paintColor: 'blue' },      // Tutorial
  { x: 170, y: 6860, type: 'paint', paintColor: 'pink' },      // Late tutorial
  { x: 230, y: 5360, type: 'paint', paintColor: 'green' },     // Mid challenge
  { x: 200, y: 3860, type: 'paint', paintColor: 'orange' },    // Upper challenge
  { x: 250, y: 2690, type: 'paint', paintColor: 'purple' },    // Climax lower
  { x: 170, y: 1630, type: 'paint', paintColor: 'yellow' },    // Climax middle

  // ===== ACCESSORIES (10 total) =====
  // Easy to reach (on main path)
  { x: 170, y: 7330, type: 'accessory', accessoryName: 'bow' },
  { x: 420, y: 6980, type: 'accessory', accessoryName: 'partyhat' },
  { x: 350, y: 5500, type: 'accessory', accessoryName: 'sunglasses' },

  // Medium difficulty (slight detour)
  { x: 130, y: 4690, type: 'accessory', accessoryName: 'crown' },
  { x: 420, y: 3280, type: 'accessory', accessoryName: 'tophat' },

  // Hard to reach (on detour platforms)
  { x: 510, y: 7020, type: 'accessory', accessoryName: 'flower' },
  { x: 30, y: 5700, type: 'accessory', accessoryName: 'star' },
  { x: 510, y: 4440, type: 'accessory', accessoryName: 'mustache' },
  { x: 530, y: 1960, type: 'accessory', accessoryName: 'cape' },
  { x: 30, y: 1040, type: 'accessory', accessoryName: 'wings' },
];

// Player spawn point
export const SPAWN_X = center - 20;
export const SPAWN_Y = 7850;

// Summit trigger zone
export const SUMMIT_Y = 330;
