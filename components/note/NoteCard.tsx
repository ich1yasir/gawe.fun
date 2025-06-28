import { Note } from "../../models/Note";
type NoteCardProps = {
    note: Note;
    onEdit?: () => void;
    onDelete?: () => void;
    onPin?: () => void;
    onClick?: () => void;
};
const ICON_COLOR = "currentColor";

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={ICON_COLOR}>
        <path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"/>
    </svg>
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

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onPin, onClick }) => (
    <div
        className="relative group p-4 rounded-lg shadow max-w-md bg-white/60 dark:bg-gray-800/60 transition flex flex-col
        min-h-[180px]
        hover:shadow-2xl hover:border hover:border-blue-500 hover:bg-white dark:hover:bg-gray-800
        hover:bg-opacity-100 dark:hover:bg-opacity-100
        cursor-pointer
        hover:scale-102
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
            <p className="mt-2 text-gray-700 dark:text-gray-300">{note.content}</p>
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
                onClick={onEdit}
                aria-label="Edit"
                type="button"
            >
                <EditIcon />
            </button>
            <button
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                onClick={onDelete}
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
        {/* Make the whole card clickable for edit if onEdit is provided */}
        {onEdit && (
            <button
                className="absolute inset-0 z-10 cursor-pointer bg-transparent border-0 p-0 m-0"
                style={{ outline: "none" }}
                aria-label="Open note"
                onClick={onEdit}
                tabIndex={-1}
            />
        )}
    </div>
);

export default NoteCard;

export type { NoteCardProps };
