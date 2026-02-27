import { AABB } from '@/types';

// Check if two AABBs overlap
export function aabbOverlap(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// One-way platform collision check
// Returns the amount to push the player up, or 0 if no collision
// Only collides when player is moving downward and was above the platform
export function oneWayPlatformCollision(
  playerAABB: AABB,
  playerVY: number,
  playerPrevY: number,
  platformAABB: AABB
): number {
  // Only collide when falling
  if (playerVY < 0) return 0;

  // Player's feet position
  const playerBottom = playerAABB.y + playerAABB.height;
  const playerPrevBottom = playerPrevY + playerAABB.height;
  const platformTop = platformAABB.y;

  // Was above platform last frame and now overlapping
  if (playerPrevBottom <= platformTop + 2 && playerBottom >= platformTop) {
    // Check horizontal overlap
    if (
      playerAABB.x + playerAABB.width > platformAABB.x &&
      playerAABB.x < platformAABB.x + platformAABB.width
    ) {
      return playerBottom - platformTop;
    }
  }

  return 0;
}

// Simple circle-rect overlap for collectible pickup
export function circleRectOverlap(
  cx: number,
  cy: number,
  cr: number,
  rect: AABB
): boolean {
  const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < cr * cr;
}
