import React from 'react';
import './BirdComponent.css';

function BirdComponent({ bird }) {
    return (
        <div
            className = "bird"
            style={{ left: '${bird.x}px', top: '${bird.y}px' }}    
        />
    )
}
