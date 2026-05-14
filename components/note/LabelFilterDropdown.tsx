import React, { useRef, useState, useEffect } from "react";

interface LabelFilterDropdownProps {
  allLabels: string[];
  selectedLabels: string[];
  setSelectedLabels: (labels: string[]) => void;
  labelSearch: string;
  setLabelSearch: (search: string) => void;
  isFab?: boolean;
}


const LabelFilterDropdown: React.FC<LabelFilterDropdownProps> = ({
  allLabels,
  selectedLabels,
  setSelectedLabels,
  labelSearch,
  setLabelSearch,
  isFab = false,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtered label options for dropdown search
  const filteredLabelOptions = allLabels.filter(l => l.toLowerCase().includes(labelSearch.toLowerCase()));

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Handle label selection (checkbox style)
  const handleLabelToggle = (label: string) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter(l => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  if (allLabels.length === 0) return null;

  // FAB mode for mobile
  if (isFab) {
    return (
      <div>
        {/* FAB button */}
        <div className="fixed bottom-2 right-4 z-40">
          <button
            type="button"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-600 text-white shadow-lg text-2xl focus:outline-none focus:ring-4 focus:ring-emerald-400 relative"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Filter by label"
          >
            {/* Centered note icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto my-auto"
              aria-hidden="true"
            >
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <line x1="8" y1="7" x2="16" y2="7" />
              <line x1="8" y1="11" x2="16" y2="11" />
              <line x1="8" y1="15" x2="12" y2="15" />
            </svg>
            {/* Badge for number of filters applied */}
            {selectedLabels.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full px-1 py-0.5 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center leading-none">
                {selectedLabels.length}
              </span>
            )}
          </button>
        </div>
        {/* Dropdown modal overlay */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/30" onClick={() => setOpen(false)}>
            <div
              className="w-full max-w-xs mx-4 mb-24 bg-white dark:bg-gray-800 border border-emerald-600 dark:border-emerald-400 rounded-lg shadow-2xl p-4 flex flex-col gap-2"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Filter by label</span>
                <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl" onClick={() => setOpen(false)} aria-label="Close">×</button>
              </div>
              <input
                type="text"
                placeholder="Search label..."
                value={labelSearch}
                onChange={e => setLabelSearch(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                autoFocus
              />
              <div className="overflow-y-auto max-h-48 flex flex-col gap-2 py-1">
                {filteredLabelOptions.length === 0 ? (
                  <span className="text-xs text-gray-400 px-2 py-2">No labels found</span>
                ) : (
                  filteredLabelOptions.map(label => (
                    <label
                      key={label}
                      className={
                        `flex items-center gap-3 text-sm px-3 py-2 rounded-md cursor-pointer transition-colors duration-150 ` +
                        (selectedLabels.includes(label)
                          ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 font-semibold'
                          : 'hover:bg-emerald-50 dark:hover:bg-emerald-800')
                      }
                      style={{ minHeight: '2.25rem' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLabels.includes(label)}
                        onChange={() => handleLabelToggle(label)}
                        className="accent-emerald-600 w-4 h-4 rounded border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="truncate">{label}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop: show as clickable chips (no search input)
  return (
    <div className="px-2 mt-2 mb-2" ref={dropdownRef}>
      <label className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2 block">Filter by label</label>
      <div className="flex flex-wrap gap-1">
        {allLabels.length === 0 ? (
          <span className="text-xs text-gray-400 px-2 py-2">No labels found</span>
        ) : (
          allLabels.map(label => (
            <button
              key={label}
              type="button"
              onClick={() => handleLabelToggle(label)}
              className={
                `px-3 py-1 rounded-full border text-xs font-medium transition-colors duration-150 focus:outline-none ` +
                (selectedLabels.includes(label)
                  ? 'bg-emerald-600 text-white border-emerald-700 dark:bg-emerald-800 dark:text-emerald-100 dark:border-emerald-400 shadow'
                  : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900 dark:hover:text-emerald-200')
              }
            >
              {label}
              {selectedLabels.includes(label) && (
                <span className="ml-1 text-xs align-middle">×</span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default LabelFilterDropdown;
