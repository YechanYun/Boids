



    

import React, { useEffect, useState, useRef } from 'react'
// import { motion } from 'framer-motion'
import './App.css'

import { Bird } from './Bird.js'
import { BIRDS_NUM, CANVAS_HEIGHT, CANVAS_WIDTH } from './constants'
import { nearbyBirds } from './utilities.js'

function App() {

  let initialBirds = Array.from({ length: BIRDS_NUM }, () => 
    new Bird(
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      Math.random() * 30,
      Math.random() * 30
    )
  )
  const [birds, setBirds] = useState(initialBirds)
  const canvasRef = useRef(null)
  const prevTimestamp = useRef(null)

  console.log("START HERERE")
        birds.forEach(b => {
          if (!(b instanceof Bird)) {
            console.log("NOT A BIRD: ", b)
          }
        })

  /*
  // initialisation - called only after the first render - since dependencies is empty list
  useEffect(() => 
    {
      let initialBirds = Array(new Bird(
        Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, Math.random() * 30, Math.random() * 30
      ), BIRDS_NUM)      

      // after setBirds called, rendering
      setBirds(initialBirds)
    }, [])
  */
    // called everytime setBirds is called
  
  useEffect((timestamp) => 
    { 
      // console.log("insides")
      const ctx = canvasRef.current.getContext('2d')
      
      const updateFrame = () => {
        // console.log(birds)

        if (!prevTimestamp.current) {
          prevTimestamp.current = timestamp
        }
        
        const deltaTime = (timestamp - prevTimestamp) / 1000 // convert into seconds
        prevTimestamp.current = timestamp
      
        console.log("UNDERNEATH HERERE")
        birds.forEach(b => {
          if (!(b instanceof Bird)) {
            console.log("NOT A BIRD: ", b)
          }
        })
        birds.forEach(b => {
          let others = nearbyBirds(b, birds);
          // b.separate(others);
          b.align(others);
          b.cohere(others);
          b.screenTurn(others);
          }
        )
        birds.forEach(b => b.update(deltaTime))

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        birds.forEach(b => {
          ctx.beginPath();
          ctx.arc(b.x, b.y, 20, 0, 2 * Math.PI); // Circle centered at (100, 100) with radius 20
          ctx.fillStyle = 'blue'; // Fill color
          ctx.fill(); // Fill the circle with the blue color
          ctx.closePath(); // Close the path
          }
        )

        // setBirds(newBirds)
        requestAnimationFrame(updateFrame)
      }

    updateFrame()
    
    }, birds)


  return (
    <div className="App">
      <h1>React Animation Example</h1>
      <canvas 
        ref = {canvasRef}
        width = {CANVAS_WIDTH}
        height = {CANVAS_HEIGHT}
        style = {{ display: 'block' }}
      />
    </div>
  );
}

export default App;


/*
  useEffect((timestamp) => 
    { 
      console.log("insides")
      const ctx = canvasRef.current.getContext('2d')
      
      const updateFrame = () => {

        if (!prevTimestamp) {
          prevTimestamp.current = timestamp
        }
        
        const deltaTime = (timestamp - prevTimestamp) / 1000 // convert into seconds
        prevTimestamp.current = timestamp

        let newBirds = birds.map(b => (
          new Bird(b.x, b.y, b.velX, b.vely)
          )
        )
        newBirds.forEach(b => {
          let others = nearbyBirds(b, newBirds);
          b.separate(others)
          b.align(others)
          b.cohere(others)
          b.screenTurn(others)
          b.update(deltaTime)
          }
        )
        newBirds.forEach(b => b.update())

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        newBirds.forEach(b => {
          ctx.beginPath();
          ctx.arc(b.x, b.y, 20, 0, 2 * Math.PI); // Circle centered at (100, 100) with radius 20
          ctx.fillStyle = 'blue'; // Fill color
          ctx.fill(); // Fill the circle with the blue color
          ctx.closePath(); // Close the path
          }
        )

        setBirds(newBirds)
        requestAnimationFrame(updateFrame)
      }

    updateFrame()
    
    }, birds)
    */

