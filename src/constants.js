import { Bird } from "./Bird.js"

// scene
export const CANVAS_WIDTH = 2000
export const CANVAS_HEIGHT = 1000
export const leftRightMargin = 100
export const topBottomMargin = 100
export const BACKGROUND_COLOR = "#0f3968"

// bird
export const maxSpeed = 300
export const minSpeed = 220
export const RADIUS = 5
export const BIRD_COLOR = "#ffffff"

// Initialize birds
export const BIRDS_NUM = 200
export const INITIAL_BIRDS = Array.from({ length: BIRDS_NUM }, () => 
new Bird(
    Math.random() * CANVAS_WIDTH,
    Math.random() * CANVAS_HEIGHT,
    Math.random() * 100 - 15, // Adjusted to include negative velocities
    Math.random() * 100 - 15  // Adjusted to include negative velocities
    )
);


// updating bird's posiiton/velocity
export const PROTECTED_RANGE_DISTANCE = 15

export const INITIAL_SEP_FACTOR = 0.2
export const INITIAL_ALIGN_FACTOR = 0.05
export const INITIAL_COHESION_FACTOR = 0.05 // 0.0005 recommended

export const MAX_SEP_FACTOR = 20
export const MAX_ALIGN_FACTOR = 1
export const MAX_COHESION_FACTOR = 1

export const SEP_STEP = "1" 
export const ALIGN_STEP = "0.01"
export const COHESION_STEP = "0.01"

// turning screen edge rate
export const INITIAL_TURN_FACTOR = 10
export const MAX_TURN_FACTOR = "40"
export const TURN_FACTOR_STEP = "0.2"

// others
export const visibleRangeDistance = 40

// cursor
export const SMELLING_RANGE = 400
export const CURSOR_ATTRACTION_FACTOR = 15
export const CURSOR_THROTTLE_RATE = 1000

// obstacles
export const OBSTACLE_RADIUS = 5
