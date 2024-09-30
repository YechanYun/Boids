export class Point {
    constructor(
        x,
        y
    ) {
        this.x = x
        this.y = y
    }

    rotate(angle) {

        // Calculate the rotated coordinates
        const rotatedX = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        const rotatedY = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        
        return new Point(rotatedX, rotatedY);
    } 

    transpose(dx, dy) {

        return new Point(this.x + dx, this.y + dy)
    }

    minus(otherPoint) {
        
        return new Point(this.x - otherPoint.x, this.y - otherPoint.y)
    }

    magnitude() {

        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    multiply(scalar) {

        return new Point(this.x * scalar, this.y * scalar)
    }
}
