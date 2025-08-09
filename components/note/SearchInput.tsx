const SearchInput: React.FC<{
    value: string;
    onChange: (v: string) => void;
}> = ({ value, onChange }) => (
    <div className="relative w-full">
        <input
            type="text"
            placeholder="Search notes..."
            className="w-full pr-10 px-3 py-2 border rounded focus:outline-none bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-400 focus:shadow-md"
            value={value}
            onChange={e => onChange(e.target.value)}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 pointer-events-none">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        </span>
    </div>
);

export default SearchInput;