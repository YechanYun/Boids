import { BIRD_COLOR, RADIUS } from "./constants"

// between two birds
const squaredDistance = function (b1, b2) { 
    return (b1.x - b2.x) ** 2 + (b1.y - b2.y) ** 2
}

// excludes the bird itself
export function nearbyBirds(current, all, distance) {
    return new Set ([...all].filter(b => 
        (b !== current && squaredDistance(current, b) <= distance ** 2)
        )    
    )
}
    
export function drawCircle(x, y, ctx) {
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, 2 * Math.PI); // Draw a circle with radius 20
    ctx.fillStyle = BIRD_COLOR; // Fill color
    ctx.fill(); // Fill the circle with the blue color
    ctx.closePath(); // Close the path
}
