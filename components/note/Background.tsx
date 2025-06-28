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
    'bg-blue-300/80 dark:bg-blue-800/80',
    'bg-green-300/80 dark:bg-green-800/80',
    'bg-red-300/80 dark:bg-red-800/80',
    'bg-yellow-300/80 dark:bg-yellow-800/80',
    'bg-purple-300/80 dark:bg-purple-800/80',
    'bg-pink-300/80 dark:bg-pink-800/80',
    'bg-orange-300/80 dark:bg-orange-800/80',
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
            const numberOfBlocks = 10; 
            for (let i = 0; i < numberOfBlocks; i++) {
                const size = Math.random() * 60 + 80; // 60px to 100px
                newBlocks.push({
                    id: i,
                    x: Math.random() * 90, // 0vw to 90vw
                    y: Math.random() * 20, // 0vh to 20vh (top of screen)
                    size,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    delay: Math.random() * 1,
                    rotation: Math.random() * 40 - 20, // -20deg to 20deg
                });
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
        <div className="absolute inset-0 overflow-hidden -z-10">
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/60 dark:bg-black/40 pointer-events-none z-10" />
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
                    absolute shadow-lg
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
