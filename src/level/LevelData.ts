import { PlatformData, CollectibleData } from '@/types';
import { LEVEL_WIDTH } from '@/engine/Physics';

// Level 1: ~8000px tall, ~90 platforms, 16 collectibles
// Bottom 20% (6400-8000): Tutorial zone - wide platforms, easy gaps
// Middle 50% (2400-6400): Main challenge - narrower, wider gaps, moving + crumbly
// Top 30% (0-2400): Climax - small platforms, large gaps, risk/reward detours
// Summit: y=200, large platform triggers spelling challenge

const W = LEVEL_WIDTH; // 600
const center = W / 2;

export const PLATFORMS: PlatformData[] = [
  // ===== GROUND / SPAWN AREA (y: 7800-7900) =====
  { x: 0, y: 7900, width: W, type: 'normal' }, // Full-width ground

  // ===== TUTORIAL ZONE (y: 6400-7800) - Wide platforms, gentle progression =====
  { x: 50, y: 7700, width: 200, type: 'normal' },
  { x: 350, y: 7650, width: 200, type: 'normal' },
  { x: 150, y: 7500, width: 250, type: 'normal' },
  { x: 400, y: 7400, width: 160, type: 'normal' },
  { x: 50, y: 7300, width: 200, type: 'normal' },
  { x: 300, y: 7200, width: 200, type: 'normal' },
  { x: 100, y: 7050, width: 180, type: 'normal' },
  { x: 350, y: 6950, width: 180, type: 'normal' },
  { x: 50, y: 6800, width: 220, type: 'normal' },
  { x: 320, y: 6700, width: 200, type: 'normal' },
  { x: 150, y: 6550, width: 200, type: 'normal' },
  { x: 380, y: 6450, width: 180, type: 'normal' },

  // ===== MAIN CHALLENGE - Lower (y: 5200-6400) =====
  { x: 80, y: 6300, width: 160, type: 'normal' },
  { x: 320, y: 6180, width: 140, type: 'normal' },
  { x: 100, y: 6050, width: 150, type: 'moving', moveRange: 80, moveSpeed: 1.2, moveAxis: 'x' },
  { x: 380, y: 5920, width: 130, type: 'normal' },
  { x: 150, y: 5800, width: 140, type: 'normal' },
  { x: 350, y: 5680, width: 120, type: 'crumbly' },
  { x: 50, y: 5560, width: 160, type: 'normal' },
  { x: 300, y: 5440, width: 140, type: 'normal' },
  { x: 100, y: 5320, width: 150, type: 'moving', moveRange: 100, moveSpeed: 1.5, moveAxis: 'x' },
  { x: 400, y: 5200, width: 130, type: 'normal' },

  // ===== MAIN CHALLENGE - Middle (y: 4000-5200) =====
  { x: 200, y: 5100, width: 130, type: 'normal' },
  { x: 50, y: 4980, width: 120, type: 'normal' },
  { x: 350, y: 4860, width: 140, type: 'crumbly' },
  { x: 150, y: 4740, width: 130, type: 'normal' },
  { x: 400, y: 4620, width: 120, type: 'moving', moveRange: 70, moveSpeed: 1.3, moveAxis: 'x' },
  { x: 80, y: 4500, width: 140, type: 'normal' },
  { x: 300, y: 4380, width: 130, type: 'normal' },
  { x: 50, y: 4260, width: 120, type: 'crumbly' },
  { x: 250, y: 4140, width: 150, type: 'normal' },
  { x: 420, y: 4020, width: 120, type: 'normal' },

  // ===== MAIN CHALLENGE - Upper (y: 2800-4000) =====
  { x: 100, y: 3900, width: 140, type: 'normal' },
  { x: 350, y: 3780, width: 120, type: 'moving', moveRange: 90, moveSpeed: 1.4, moveAxis: 'x' },
  { x: 50, y: 3660, width: 130, type: 'normal' },
  { x: 300, y: 3540, width: 110, type: 'crumbly' },
  { x: 150, y: 3420, width: 130, type: 'normal' },
  { x: 400, y: 3300, width: 120, type: 'normal' },
  { x: 50, y: 3180, width: 140, type: 'moving', moveRange: 100, moveSpeed: 1.6, moveAxis: 'x' },
  { x: 280, y: 3060, width: 120, type: 'normal' },
  { x: 100, y: 2940, width: 110, type: 'normal' },
  { x: 380, y: 2820, width: 130, type: 'crumbly' },

  // ===== CLIMAX ZONE - Lower (y: 1800-2800) =====
  { x: 200, y: 2700, width: 110, type: 'normal' },
  { x: 420, y: 2580, width: 100, type: 'normal' },
  { x: 80, y: 2460, width: 110, type: 'moving', moveRange: 80, moveSpeed: 1.8, moveAxis: 'x' },
  { x: 320, y: 2340, width: 100, type: 'crumbly' },
  { x: 150, y: 2220, width: 100, type: 'normal' },
  { x: 400, y: 2100, width: 90, type: 'normal' },
  { x: 50, y: 1980, width: 110, type: 'normal' },
  { x: 300, y: 1860, width: 100, type: 'moving', moveRange: 60, moveSpeed: 2.0, moveAxis: 'x' },

  // ===== CLIMAX ZONE - Middle (y: 1000-1800) =====
  { x: 150, y: 1750, width: 100, type: 'normal' },
  { x: 400, y: 1640, width: 90, type: 'crumbly' },
  { x: 80, y: 1530, width: 100, type: 'normal' },
  { x: 320, y: 1420, width: 90, type: 'normal' },
  { x: 50, y: 1310, width: 110, type: 'moving', moveRange: 70, moveSpeed: 1.8, moveAxis: 'x' },
  { x: 280, y: 1200, width: 90, type: 'normal' },
  { x: 450, y: 1100, width: 80, type: 'crumbly' },
  { x: 120, y: 1000, width: 100, type: 'normal' },

  // ===== CLIMAX ZONE - Upper (y: 400-1000) =====
  { x: 350, y: 900, width: 90, type: 'normal' },
  { x: 100, y: 800, width: 100, type: 'moving', moveRange: 80, moveSpeed: 2.0, moveAxis: 'x' },
  { x: 380, y: 700, width: 80, type: 'normal' },
  { x: 150, y: 600, width: 90, type: 'crumbly' },
  { x: 400, y: 500, width: 100, type: 'normal' },
  { x: 50, y: 400, width: 110, type: 'normal' },

  // ===== DETOUR PATHS (harder-to-reach side platforms for accessories) =====
  // Tutorial detour (far right)
  { x: 480, y: 7100, width: 100, type: 'normal' },  // leads to flower
  // Mid-level detour (far left)
  { x: 0, y: 5650, width: 80, type: 'normal' },    // leads to star
  // Upper detour (high risk platform chain)
  { x: 480, y: 4500, width: 80, type: 'crumbly' },   // leads to mustache
  // Climax detour (very hard reach)
  { x: 500, y: 2000, width: 70, type: 'normal' },    // leads to cape
  { x: 0, y: 1150, width: 70, type: 'crumbly' },     // leads to wings (hardest)

  // ===== SUMMIT PLATFORM (y: 200) =====
  { x: center - 150, y: 200, width: 300, type: 'normal' }, // Large summit platform
];

export const COLLECTIBLES: CollectibleData[] = [
  // ===== PAINT BUCKETS (6 total) - on main path =====
  { x: 250, y: 7475, type: 'paint', paintColor: 'blue' },      // Tutorial zone
  { x: 420, y: 6650, type: 'paint', paintColor: 'pink' },       // Late tutorial
  { x: 200, y: 5075, type: 'paint', paintColor: 'green' },      // Mid challenge
  { x: 350, y: 3750, type: 'paint', paintColor: 'orange' },     // Upper challenge
  { x: 200, y: 2675, type: 'paint', paintColor: 'purple' },     // Climax lower
  { x: 150, y: 1725, type: 'paint', paintColor: 'yellow' },     // Climax middle

  // ===== ACCESSORIES (10 total) =====
  // Easy to reach (on main path)
  { x: 170, y: 7275, type: 'accessory', accessoryName: 'bow' },          // Tutorial
  { x: 380, y: 6900, type: 'accessory', accessoryName: 'partyhat' },     // Tutorial
  { x: 350, y: 5400, type: 'accessory', accessoryName: 'sunglasses' },   // Main challenge

  // Medium difficulty (slight detour)
  { x: 130, y: 4700, type: 'accessory', accessoryName: 'crown' },        // Main challenge mid
  { x: 400, y: 3250, type: 'accessory', accessoryName: 'tophat' },       // Upper challenge

  // Hard to reach (on detour platforms)
  { x: 510, y: 7060, type: 'accessory', accessoryName: 'flower' },       // Tutorial detour
  { x: 30, y: 5610, type: 'accessory', accessoryName: 'star' },          // Mid detour
  { x: 510, y: 4460, type: 'accessory', accessoryName: 'mustache' },     // Upper detour (crumbly!)
  { x: 530, y: 1960, type: 'accessory', accessoryName: 'cape' },         // Climax detour
  { x: 30, y: 1110, type: 'accessory', accessoryName: 'wings' },         // Hardest - crumbly platform!
];

// Player spawn point
export const SPAWN_X = center - 20;
export const SPAWN_Y = 7850;

// Summit trigger zone
export const SUMMIT_Y = 250;
