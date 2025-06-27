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

// Using lighter, less saturated colors for background with opacity for both light and dark modes
const colors = [
  'bg-blue-300/20 dark:bg-blue-800/20',
  'bg-green-300/20 dark:bg-green-800/20',
  'bg-red-300/20 dark:bg-red-800/20',
  'bg-yellow-300/20 dark:bg-yellow-800/20',
  'bg-purple-300/20 dark:bg-purple-800/20',
];

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
            const numberOfBlocks = 50; // Adjust as needed

            for (let i = 0; i < numberOfBlocks; i++) {
                newBlocks.push({
                    id: i,
                    x: Math.random() * 100,
                    width: Math.random() * 30 + 10, // Random width between 10px and 40px
                    height: Math.random() * 150 + 50, // Random height between 50px and 200px
                    color: colors[Math.floor(Math.random() * colors.length)],
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
                    className={`${block.color} absolute origin-bottom animate-grow-from-bottom transition-all duration-300 ease-out hover:scale-105 hover:brightness-125 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
