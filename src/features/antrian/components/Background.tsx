'use client'
import React, { KeyboardEvent, useEffect, useState } from 'react';

interface Block {
  id: number;
  x: number;
  width: number;
  height: number;
  color: string;
  delay: number;
}

const colors = [
    'bg-gray-200/60 dark:bg-gray-700/60',
    'bg-gray-300/60 dark:bg-gray-600/60',
    'bg-gray-400/60 dark:bg-gray-500/60',
    'bg-gray-100/60 dark:bg-gray-800/60',
    'bg-gray-300/60 dark:bg-gray-900/60',
];
const colorRed = 'bg-red-500/60 dark:bg-red-700/60'

const Background: React.FC = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);

    const handleBlockClick = (id: number) => {
        setBlocks(currentBlocks =>
            currentBlocks.map(block => {
                if (block.id === id) {
                    // Cycle to the next color on click
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
            const numberOfBlocks = 60; // Adjust as needed
            const blockWidth = 20; // Fixed width in px, adjust as needed
            const gap = 8; // Gap between blocks in px, adjust as needed
            const totalWidth = numberOfBlocks * blockWidth + (numberOfBlocks - 1) * gap;
            const screenWidth = window.innerWidth;
            const scale = screenWidth < totalWidth ? screenWidth / totalWidth : 1;

            // Randomly pick one index to use colorRed
            const redBlockIndex = Math.floor(Math.random() * numberOfBlocks);

            for (let i = 0; i < numberOfBlocks; i++) {
            const width = blockWidth * scale;
            const xPx = i * (blockWidth + gap) * scale;
            const x = (xPx / screenWidth) * 100; // convert px to vw
            newBlocks.push({
                id: i,
                x,
                width,
                height: Math.random() * 150 + 50, // Random height between 50px and 200px
                color: i === redBlockIndex
                ? colorRed
                : colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 10,
            });
            }
            setBlocks(newBlocks);
        };

        generateBlocks();

        // Optional: Regenerate blocks on window resize
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
        <div className="absolute inset-0 overflow-hidden -z-10">
            {blocks.map((block) => (
                <div
                    key={block.id}
                    onClick={() => handleBlockClick(block.id)}
                    onKeyDown={(e) => handleKeyDown(e, block.id)}
                    role="button"
                    tabIndex={0}
                    className={`
                        ${block.color}
                        absolute origin-bottom animate-grow-from-bottom transition-all duration-300 ease-out
                        hover:scale-105 hover:brightness-125 cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        shadow-lg dark:shadow-lg dark:shadow-gray-600/60
                        shadow-gray-400 
                    `}
                    style={{
                        left: `${block.x}vw`,
                        bottom: 0,
                        width: `${block.width}px`,
                        height: `${block.height}px`,
                        animationDelay: `${block.delay}s`,
                    }}
                ></div>
            ))}
        </div>
    );
};

export default Background;
