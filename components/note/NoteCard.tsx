import { Note } from "../../models/Note";
type NoteCardProps = {
    note: Note;
    onDuplicate?: () => void;
    onDelete?: () => void;
    onPin?: () => void;
    onClick?: () => void;
};
const ICON_COLOR = "currentColor";

// Duplicate icon (two overlapping documents)
const DuplicateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={ICON_COLOR}><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={ICON_COLOR}>
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
    </svg>
);

const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={ICON_COLOR}>
        <path d="M380-400h60v-120h180l-60-80 60-80H380v280ZM200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
    </svg>
);



const NoteCard: React.FC<NoteCardProps> = ({ note, onDuplicate, onDelete, onPin, onClick }) => (
    <div
        className="relative group p-4 rounded-lg shadow max-w-md bg-white/80 dark:bg-gray-800/80 transition flex flex-col
        min-h-[180px]
        border border-white dark:border-gray-800 
        hover:shadow-2xl hover:border hover:border-emerald-600 hover:dark:border-emerald-400 hover:bg-white dark:hover:bg-gray-800
        hover:bg-opacity-100 dark:hover:bg-opacity-100
        cursor-pointer
        hover:scale-100
        duration-200
        "
        style={{ minHeight: 180 }}
        onClick={onClick}
    >
        <div className="mb-2">
            <strong className="block text-lg text-gray-900 dark:text-gray-100">{note.title}</strong>
            {note.date && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(note.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}
                </div>
            )}
        </div>
        <div className="flex-1">
            <p
                className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line overflow-hidden"
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 17,
                    WebkitBoxOrient: "vertical",
                    textOverflow: "ellipsis"
                }}
                title={note.content}
            >
                {note.content}
            </p>
        </div>
        {Array.isArray(note.label) && note.label.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1 justify-start text-xs">
                {note.label.map((lbl: string, idx: number) => (
                    <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                        {lbl}
                    </span>
                ))}
            </div>
        )}
        <div className="absolute cursor-pointer left-0 right-0 bottom-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto px-4">
            <button
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                onClick={e => { e.stopPropagation(); onDuplicate && onDuplicate(); }}
                aria-label="Duplicate"
                type="button"
            >
                <DuplicateIcon />
            </button>
            <button
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                onClick={e => { e.stopPropagation(); onDelete && onDelete(); }}
                aria-label="Delete"
                type="button"
            >
                <TrashIcon />
            </button>
            <button
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                onClick={onPin}
                aria-label="Pin"
                type="button"
            >
                <PinIcon />
            </button>
        </div>
    </div>
);

export default NoteCard;

export type { NoteCardProps };
