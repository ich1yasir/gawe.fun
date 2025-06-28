import React, { useRef } from "react";

interface NoteInputProps {
    value: string;
    onChange: (value: string) => void;
    onFocus: () => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ value, onChange, onFocus }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="relative w-full">
            <input
                ref={inputRef}
                type="text"
                placeholder="Take a note..."
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={onFocus}
            className="w-full pr-10 px-3 py-2 border rounded focus:outline-none bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:shadow-md"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 pointer-events-none">
            {/* New note icon (simple plus in a note) */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            </span>
        </div>
    );
};

export default NoteInput;

export type { NoteInputProps };
