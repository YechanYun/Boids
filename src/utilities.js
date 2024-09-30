import { BIRD_COLOR, RADIUS } from "./constants"
import { Point } from "./Point.js"

// between two birds
const squaredDistance = function (b1, b2) { 
    return (b1.x - b2.x) ** 2 + (b1.y - b2.y) ** 2
}

export function nearbyBirds(current, all, distance) {
    return new Set ([...all].filter(b => 
        (b !== current && squaredDistance(current, b) <= distance ** 2)
        )    
    )
}

// angle is bearing from horizontal to elongated vertex in radians
export function drawTriangle(x, y, angle, ctx) {

    let vertex = [new Point(0, 10), new Point(0, -10), new Point(20, 0)]
    vertex = vertex.map(p => p.rotate(angle).transpose(x, y));
    
    // drawing triangle
    ctx.beginPath()
    ctx.moveTo(vertex[0].x, vertex[0].y)
    ctx.lineTo(vertex[1].x, vertex[1].y)
    ctx.lineTo(vertex[2].x, vertex[2].y)
    ctx.closePath()

    // colouring
    ctx.fillStyle = BIRD_COLOR
    ctx.fill()

    }
    
export function drawCircle(x, y, ctx) {
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, 2 * Math.PI); // Draw a circle with radius 20
    ctx.fillStyle = BIRD_COLOR; // Fill color
    ctx.fill(); // Fill the circle with the blue color
    ctx.closePath(); // Close the path
}
