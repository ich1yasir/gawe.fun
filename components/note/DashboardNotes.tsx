import React from "react";
import NoteCard from "./NoteCard";
import { Note } from "../../models/Note";

type DashboardNotesProps = {
    pinnedNotes: Note[];
    notes: Note[];
    showPinned: boolean;
    setShowPinned: (show: boolean) => void;
    handleNoteCardClick: (note: Note) => void;
    handleDuplicateNote: (note: Note) => void;
    handleDeleteNote: (id: number) => void;
    handlePinNote: (note: Note) => void;
    loaderRef: React.RefObject<HTMLDivElement | null>;
    hasMore: boolean;
};

const DashboardNotes: React.FC<DashboardNotesProps> = ({
    pinnedNotes,
    notes,
    showPinned,
    setShowPinned,
    handleNoteCardClick,
    handleDuplicateNote,
    handleDeleteNote,
    handlePinNote,
    loaderRef,
    hasMore,
}) => (
    <>
        {/* Pinned Notes List (collapsible) */}
        {pinnedNotes.length > 0 && (
            <>
                <div className="flex items-center mt-4 mb-2 px-1">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mr-2">Pinned</span>
                    <button
                        className="text-xs px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition ml-auto"
                        onClick={() => setShowPinned(!showPinned)}
                        aria-label={showPinned ? 'Collapse pinned notes' : 'Expand pinned notes'}
                        type="button"
                    >
                        {showPinned ? 'Collapse' : 'Expand'}
                    </button>
                </div>
                {showPinned && (
                    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance]">
                        {pinnedNotes.map(note => (
                            <div key={note.id} className="break-inside-avoid mb-4">
                                <NoteCard
                                    note={note}
                                    onClick={() => handleNoteCardClick(note)}
                                    onDuplicate={() => handleDuplicateNote(note)}
                                    onDelete={() => handleDeleteNote(note.id)}
                                    onPin={() => handlePinNote(note)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <div className="border-b border-dashed border-emerald-300 dark:border-emerald-700 my-4"></div>
            </>
        )}
        {/* Unpinned Notes List */}
        <div className="columns-1 sm:columns-2 mt-2 md:columns-3 gap-4 mb-20 md:mb-4 [column-fill:_balance]">
            {notes.map(note => (
                <div key={note.id} className="break-inside-avoid mb-4">
                    <NoteCard
                        note={note}
                        onClick={() => handleNoteCardClick(note)}
                        onDuplicate={() => handleDuplicateNote(note)}
                        onDelete={() => handleDeleteNote(note.id)}
                        onPin={() => handlePinNote(note)}
                    />
                </div>
            ))}
        </div>
        {/* Infinite scroll loader */}
        {hasMore && (
            <div ref={loaderRef} className="flex justify-center py-6 text-gray-500 dark:text-gray-400">
                Loading more notes...
            </div>
        )}
    </>
);

export default DashboardNotes;
