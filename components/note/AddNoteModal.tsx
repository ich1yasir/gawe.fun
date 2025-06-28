import React, { useState } from "react";

type AddNoteModalProps = {
    open: boolean;
    title: string;
    content: string;
    date: Date;
    label: string[];
    onTitleChange: (val: string) => void;
    onContentChange: (val: string) => void;
    onDateChange: (val: Date) => void;
    onLabelChange: (val: string[]) => void;
    onClose: () => void;
    onAdd: () => void;
};

const AddNoteModal: React.FC<AddNoteModalProps> = ({
    open,
    title,
    content,
    date,
    label,
    onTitleChange,
    onContentChange,
    onDateChange,
    onLabelChange,
    onClose,
    onAdd,
}) => {
    const [touched, setTouched] = useState(false);
    const [labelInput, setLabelInput] = useState("");

    if (!open) return null;

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleAdd = () => {
        setTouched(true);
        if (title.trim() && content.trim()) {
            onAdd();
            setTouched(false);
        }
    };

    const showTitleError = touched && !title.trim();
    const showContentError = touched && !content.trim();

    // Convert Date to yyyy-MM-dd for input value
    const formatDate = (date: Date) =>
        date ? date.toISOString().split("T")[0] : "";

    const handleDateChange = (val: string) => {
        const newDate = val ? new Date(val) : new Date();
        onDateChange(newDate);
    };

    const handleLabelInputChange = (val: string) => {
        setLabelInput(val);
    };

    const handleLabelInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && labelInput.trim()) {
            e.preventDefault();
            if (!label.includes(labelInput.trim())) {
                onLabelChange([...label, labelInput.trim()]);
            }
            setLabelInput("");
        }
        if (e.key === "Backspace" && !labelInput && label.length > 0) {
            onLabelChange(label.slice(0, -1));
        }
    };

    const handleRemoveLabel = (idx: number) => {
        onLabelChange(label.filter((_, i) => i !== idx));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity"
            onClick={onClose}
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
            <div
                className="bg-white dark:bg-gray-800 pt-10 px-8 pb-8 rounded-lg shadow-lg w-full max-w-lg relative text-gray-900 dark:text-gray-100"
                onClick={handleModalClick}
            >
                <button
                    className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 cursor-pointer"
                    onClick={onClose}
                    aria-label="Close"
                    type="button"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 p-1 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={e => onTitleChange(e.target.value)}
                    className={`w-full p-2 mb-2 border ${showTitleError ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                    autoFocus
                    required
                />
                {showTitleError && (
                    <div className="text-red-500 text-sm mb-2">Title is required</div>
                )}
                <textarea
                    placeholder="Take a note..."
                    value={content}
                    onChange={e => onContentChange(e.target.value)}
                    rows={10}
                    className={`w-full p-2 border ${showContentError ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded resize-y min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                    required
                />
                {showContentError && (
                    <div className="text-red-500 text-sm mb-2">Content is required</div>
                )}
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1" htmlFor="note-date">
                        Date
                    </label>
                    <input
                        id="note-date"
                        type="date"
                        value={formatDate(date)}
                        onChange={e => handleDateChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1" htmlFor="note-label">
                        Label
                    </label>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {label.map((lbl, idx) => (
                            <span
                                key={lbl + idx}
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-xs flex items-center"
                            >
                                {lbl}
                                <button
                                    type="button"
                                    className="ml-1 text-blue-500 hover:text-blue-700"
                                    onClick={() => handleRemoveLabel(idx)}
                                    aria-label="Remove label"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <input
                        id="note-label"
                        type="text"
                        placeholder="Add label or tags (press Enter or comma)"
                        value={labelInput}
                        onChange={e => handleLabelInputChange(e.target.value)}
                        onKeyDown={handleLabelInputKeyDown}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    Save Note
                </button>
            </div>
        </div>
    );
};
export default AddNoteModal;

export type { AddNoteModalProps };
