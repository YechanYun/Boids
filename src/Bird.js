import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    leftRightMargin,
    topBottomMargin,
    maxSpeed,
    minSpeed,
    RADIUS,
    visibleRangeDistance,
    SMELLING_RANGE,
    CURSOR_ATTRACTION_FACTOR,
} from "./constants"

import { Point } from "./Point"

export class Bird {
    constructor(initialX, initialY, initialVelX,initialVelY) {
        this.x = initialX
        this.y = initialY
        this.velX = initialVelX
        this.velY = initialVelY
    }

    keepVelocityWithinRange() {
        // doesn't exceed maximum
        // no divisions by 0, since speed is never 0
        let max_sf = Math.min(maxSpeed / Math.sqrt(this.velX ** 2 + this.velY ** 2), 1)
        this.velX *= max_sf
        this.velY *= max_sf

        // ensure velocity doesn't fall below minimum
        let min_sf = Math.max(minSpeed / Math.sqrt(this.velX ** 2 + this.velY ** 2), 1)
        this.velX *= min_sf
        this.velY *= min_sf
    }

    separate(nearbyBirds, sepFactor) {
        let close_dx = 0
        let close_dy = 0
        nearbyBirds.forEach(
          b =>
          {
            close_dx += this.x - b.x
            close_dy += this.y - b.y
          }
        )

        if (close_dx !== 0) {
            this.velX += sepFactor / close_dx
        }
        if (close_dy !== 0) {
            this.velY += sepFactor / close_dy
        }
        this.keepVelocityWithinRange()
    }

    align(nearbyBirds, alignFactor) {
        //console.log("just outside if for align")
        if (nearbyBirds.size > 0) {
            //console.log("INSIDE ALIGN, ", typeof nearbyBirds)
            //console.log(nearbyBirds)
            const { sumVelX, sumVelY } = Array.from(nearbyBirds).reduce(
                (acc, b) => ({
                    sumVelX: acc.sumVelX + b.velX,
                    sumVelY: acc.sumVelY + b.velY
                }), { sumVelX: 0, sumVelY: 0 }
            )
            
            let avgVelX = sumVelX / nearbyBirds.size
            let avgVelY = sumVelY / nearbyBirds.size
      

            this.velX += (avgVelX - this.velX) * alignFactor
            this.velY += (avgVelY - this.velY) * alignFactor
          }
          this.keepVelocityWithinRange()
    }

    cohere(nearbyBirds, cohesionFactor) {

        // condition avoids division by 0
        if (nearbyBirds.size > 0) {
        
            const { sumX, sumY } = Array.from(nearbyBirds).reduce(
                (acc, b) => ({
                    sumX: acc.sumX + b.x,
                    sumY: acc.sumY + b.y
                }), { sumX: 0, sumY: 0 }
            )

            let avgX = sumX / nearbyBirds.size
            let avgY = sumY / nearbyBirds.size
    
            this.velX += (avgX - this.x) * cohesionFactor
            this.velY += (avgY - this.y) * cohesionFactor
        }
        this.keepVelocityWithinRange()
    }

    screenTurn(turnFactor) {
        if (this.x < leftRightMargin) {
            this.velX += turnFactor
          } else if (this.x > CANVAS_WIDTH - leftRightMargin) {
            this.velX -= turnFactor
          }
        if (this.y < topBottomMargin) {
          this.velY += turnFactor
        } else if (this.y > CANVAS_HEIGHT - topBottomMargin) {
          this.velY -= turnFactor
        }
    }
    
    // left, top, right etc. are distances:
    
    attractToCursor(cursorPos, left, top, right, bottom) {
      
      if (cursorPos == null) {
        return
      }

      // console.log("cursor")
      // check cursor is in canvas
      if (!(
        cursorPos.x > left &&
        cursorPos.x < right &&
        cursorPos.y > top &&
        cursorPos.y < bottom
      )) {
        return
      }

      if ((cursorPos.x - this.x) ** 2 + (cursorPos.y - this.y) ** 2 > SMELLING_RANGE ** 2) {
        return
      }

      let vector = cursorPos.minus(new Point(this.x, this.y))
      vector = vector.multiply(1 / vector.magnitude())

      this.velX += vector.x * CURSOR_ATTRACTION_FACTOR
      this.velY += vector.y * CURSOR_ATTRACTION_FACTOR
    }

    update(time) {
        let _x = this.x + this.velX * time
        let _y = this.y + this.velY * time
    
        // _x = _x.max(RADIUS.value).min(CANVAS_WIDTH - RADIUS.value)
        // _y = _y.max(RADIUS.value).min(CANVAS_HEIGHT - RADIUS.value)
    
        if (_x < RADIUS) {
          _x = CANVAS_WIDTH - (RADIUS - _x)
        } else if (_x > CANVAS_WIDTH - RADIUS) {
          _x = _x - (CANVAS_WIDTH - RADIUS)
        }
    
        if (_y < RADIUS) {
          _y = CANVAS_HEIGHT - (RADIUS - _y)
        } else if (_y > CANVAS_HEIGHT - RADIUS) {
          _y = _y - (CANVAS_HEIGHT - RADIUS)
        }
    
        this.x = _x
        this.y = _y
    }
}
