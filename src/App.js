import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { CURSOR_THROTTLE_RATE, 
  INITIAL_BIRDS, INITIAL_SEP_FACTOR, INITIAL_ALIGN_FACTOR, MAX_TURN_FACTOR, INITIAL_TURN_FACTOR, 
  BACKGROUND_COLOR, CANVAS_HEIGHT, CANVAS_WIDTH, 
  PROTECTED_RANGE_DISTANCE, visibleRangeDistance, 
  INITIAL_COHESION_FACTOR, MAX_COHESION_FACTOR, MAX_ALIGN_FACTOR, 
  MAX_SEP_FACTOR, SEP_STEP, ALIGN_STEP, COHESION_STEP, TURN_FACTOR_STEP} from './constants';
import { nearbyBirds, drawCircle } from './utilities.js';
import { Point } from "./Point.js"
import _ from 'lodash'

function SliderComponent({ name, value, setValue, minimum, maximum, step }) {
  let toFix = 0
  let t = step
  while (t < 1) {
    t *= 10
    toFix += 1
  }
  return (
    <div className="slider">
      <label>
        {name}:
          <input
            type="range"
            min={minimum}
            max={maximum}
            step={step}
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
          />
        {value.toFixed(toFix)}
      </label>
    </div>
    );
  }

function App() {

  // parameters
  const [turnFactor, setTurnFactor] = useState(INITIAL_TURN_FACTOR)
  const [sepFactor, setSepFactor] = useState(INITIAL_SEP_FACTOR)
  const [alignFactor, setAlignFactor] = useState(INITIAL_ALIGN_FACTOR)
  const [cohesionFactor, setCohesionFactor] = useState(INITIAL_COHESION_FACTOR)

  // tracking cursor 
  const [cursorPosition, setCursorPosition] = useState(null)

  const [birds, setBirds] = useState(INITIAL_BIRDS);
  const canvasRef = useRef(null);
  const prevTimestamp = useRef(0);

  // updating cursor
  useEffect(() => {

    const handleMouseMove = _.throttle((event) => {
      setCursorPosition(
        new Point(event.clientX, event.clientY)
      )
    }, CURSOR_THROTTLE_RATE)

    window.addEventListener("mousemove", handleMouseMove)

    // cleaning
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }

  }, [])

  // animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');  
      return;
    }

    // dimensions and position of canvas relative to viewport
    const rect = canvas.getBoundingClientRect()

    let animationFrameId

    const updateFrame = (timestamp) => {
      if (!prevTimestamp.current) {
        prevTimestamp.current = timestamp;
      }

      // console.log("running update frame, sep factor:", sepFactor)
      const deltaTime = (timestamp - prevTimestamp.current) / 1000; // Convert to seconds
      prevTimestamp.current = timestamp;

      // Update birds' states
      const updatedBirds = birds.map(bird => {
        let inProtectedRange = nearbyBirds(bird, birds, PROTECTED_RANGE_DISTANCE)
        let inVisibleRange = nearbyBirds(bird, birds, visibleRangeDistance);
        bird.separate(inProtectedRange, sepFactor);
        bird.align(inVisibleRange, alignFactor);
        bird.cohere(inVisibleRange, cohesionFactor);
        bird.screenTurn(turnFactor);
        bird.attractToCursor(cursorPosition, rect.left, rect.top, rect.right, rect.bottom)
        return bird;
      });

      // Clear the canvas and redraw birds
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.fillStyle = BACKGROUND_COLOR
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      updatedBirds.forEach(bird => {
        bird.update(deltaTime)
        drawCircle(bird.x, bird.y, ctx)
        
      });

      // Update the state with the new birds' positions
      setBirds(updatedBirds);

      // Request the next frame
      animationFrameId = requestAnimationFrame(updateFrame);
    };

    // Start the animation loop
    animationFrameId = requestAnimationFrame(updateFrame);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId)  
      prevTimestamp.current = 0; // Reset timestamp on cleanup
    };
  }, [turnFactor, sepFactor, alignFactor, cohesionFactor,
    cursorPosition
  ]); // Empty array to ensure this effect runs only once

  return (
    <div className="App">
      <h1>Birds Flocking Simulation</h1>
      <div className="container">
        <div className="canvas-wrapper">
          <canvas className="canvas"
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{ display: 'block' }}
          />
        </div>
        <div className="sliders">
          <SliderComponent  
            name = { "Separation" } 
            value = { sepFactor }
            setValue = { setSepFactor }
            minimum = { "0" } 
            maximum = { MAX_SEP_FACTOR }
            step = { SEP_STEP }/>  
          <SliderComponent  
            name = { "Alignment" } 
            value = { alignFactor }
            setValue = { setAlignFactor }
            minimum = { "0" } 
            maximum = { MAX_ALIGN_FACTOR }
            step = { ALIGN_STEP }/>
          <SliderComponent  
            name = { "Cohesion" } 
            value = { cohesionFactor }
            setValue = { setCohesionFactor }
            minimum = { "0" } 
            maximum = { MAX_COHESION_FACTOR }
            step = { COHESION_STEP }/>
          <SliderComponent  
            name = { "Turn Factor" } 
            value = { turnFactor }
            setValue = { setTurnFactor }
            minimum = { "0" } 
            maximum = { MAX_TURN_FACTOR }
            step = {TURN_FACTOR_STEP} />
        </div>
      </div>
    </div>
  );
}

export default App;
