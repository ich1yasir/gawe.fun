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
    'bg-indigo-500 dark:bg-indigo-600',
    'bg-purple-500 dark:bg-purple-600',
    'bg-pink-500 dark:bg-pink-600',
    'bg-cyan-500 dark:bg-cyan-600',
    'bg-teal-500 dark:bg-teal-600',
    'bg-sky-500 dark:bg-sky-600',
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
            const numberOfBlocks = 12;
            const sizeRange = [60, 120];
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
                        rotation: Math.random() * 30 - 15,
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
            {/* Overlay for readability with softer blue tone */}
            <div className="fixed inset-0 bg-slate-50/80 dark:bg-slate-900/60 pointer-events-none z-10" />
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
                    shadow-lg shadow-black/20
                    transition-all duration-300 ease-out
                    hover:scale-105 hover:brightness-110
                    cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500
                    rounded-lg
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
