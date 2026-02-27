// Physics constants
export const GRAVITY = 1400; // px/s²
export const JUMP_VELOCITY = -820; // px/s (negative = up) — max height ~240px
export const JUMP_CUT_MULTIPLIER = 0.4; // When releasing jump early
export const MAX_FALL_SPEED = 900; // Terminal velocity
export const MOVE_SPEED = 320; // px/s horizontal
export const MOVE_ACCEL = 2400; // px/s² acceleration
export const MOVE_DECEL = 2000; // px/s² deceleration (friction)
export const AIR_CONTROL = 0.7; // Multiplier for air movement
export const COYOTE_TIME = 0.08; // seconds (80ms)
export const JUMP_BUFFER_TIME = 0.08; // seconds (80ms)

// Player dimensions
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 40;
export const PLAYER_RENDER_SIZE = 48; // Visual size (bigger than hitbox for fluff)

// Level dimensions
export const LEVEL_WIDTH = 600;
export const LEVEL_HEIGHT = 8000;
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 900;

// Platform defaults
export const PLATFORM_HEIGHT = 16;
export const MIN_PLATFORM_WIDTH = 60;
export const DEFAULT_PLATFORM_WIDTH = 120;

// Collectible
export const COLLECTIBLE_SIZE = 32;
export const COLLECTIBLE_BOBBLE_SPEED = 2;
export const COLLECTIBLE_BOBBLE_AMOUNT = 4;
