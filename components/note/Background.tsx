'use client'
import React, { KeyboardEvent, useEffect, useState } from 'react';

interface Block {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
    rotation: number;
}

const colors = [
    'bg-blue-500 dark:bg-blue-600',
    'bg-green-500 dark:bg-green-600',
    'bg-red-500 dark:bg-red-600',
    'bg-yellow-500 dark:bg-yellow-600',
    'bg-purple-500 dark:bg-purple-600',
    'bg-pink-500 dark:bg-pink-600',
    'bg-orange-500 dark:bg-orange-600',
];

const Background: React.FC = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);

    const handleBlockClick = (id: number) => {
        setBlocks(currentBlocks =>
            currentBlocks.map(block => {
                if (block.id === id) {
                    const currentColorIndex = colors.indexOf(block.color);
                    const nextColorIndex = (currentColorIndex + 1) % colors.length;
                    return { ...block, color: colors[nextColorIndex] };
                }
                return block;
            })
        );
    };

    useEffect(() => {
        const generateBlocks = () => {
            const newBlocks: Block[] = [];
            const numberOfBlocks = 16;
            const sizeRange = [80, 140];
            const xRange = [0, 90];
            const yRange = [75, 95];
            const buffer = 8;

            // Precompute vw/vh to avoid repeated calculation
            const vw = window.innerWidth / 100;
            const vh = window.innerHeight / 100;

            let attempts = 0;
            while (newBlocks.length < numberOfBlocks && attempts < numberOfBlocks * 100) {
                const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
                const x = Math.random() * (xRange[1] - xRange[0]) + xRange[0];
                const y = Math.random() * (yRange[1] - yRange[0]) + yRange[0];
                const px = x * vw;
                const py = y * vh;

                // Check overlap with all existing blocks for better accuracy
                const overlaps = newBlocks.some(existing => {
                    const ex = existing.x * vw;
                    const ey = existing.y * vh;
                    const minDist = (existing.size + size) / 2 + buffer;
                    const dx = px - ex;
                    const dy = py - ey;
                    return dx * dx + dy * dy < minDist * minDist;
                });

                if (!overlaps) {
                    newBlocks.push({
                        id: newBlocks.length,
                        x,
                        y,
                        size,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        delay: Math.random(),
                        rotation: Math.random() * 40 - 20,
                    });
                }
                attempts++;
            }

            setBlocks(newBlocks);
        };

        generateBlocks();

        const handleResize = () => generateBlocks();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, id: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleBlockClick(id);
        }
    };
    return (
        <div className="fixed inset-0 overflow-hidden -z-10">
            {/* Overlay for readability */}
            <div className="fixed inset-0 bg-white/60 dark:bg-black/40 pointer-events-none z-10" />
            {/* Colored blocks */}
            {blocks.map((block) => (
                <div
                    key={block.id}
                    onClick={() => handleBlockClick(block.id)}
                    onKeyDown={(e) => handleKeyDown(e, block.id)}
                    role="button"
                    tabIndex={0}
                    className={`
                    ${block.color}
                    absolute
                    shadow-lg shadow-black/30
                    transition-all duration-300 ease-out
                    hover:scale-105 hover:brightness-125
                    cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500
                    rounded-md
                `}
                    style={{
                        left: `${block.x}vw`,
                        top: `${block.y}vh`,
                        width: `${block.size}px`,
                        height: `${block.size}px`,
                        transform: `rotate(${block.rotation}deg)`,
                        animationDelay: `${block.delay}s`,
                        zIndex: 5, // Ensure blocks are below overlay
                    }}
                ></div>
            ))}
        </div>
    );

};

export default Background;
