'use client'
import React, { useState, useRef } from "react";
import { Note } from "../../models/Note";
import NoteCard from "./NoteCard";
import AddNoteModal from "./AddNoteModal";
import NoteInput from "./NoteInput";
import SearchInput from "./SearchInput";
import initialNotes from "../../models/data/initialNotes";

const Dashboard: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [inputValue, setInputValue] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");
    const [modalDate, setModalDate] = useState<Date>(new Date());
    const [modalLabel, setModalLabel] = useState<string[]>([]);
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputFocus = () => {
        setModalTitle(inputValue);
        setModalContent("");
        setModalDate(new Date());
        setModalLabel([]);
        setEditingNoteId(null);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setInputValue("");
        setEditingNoteId(null);
    };

    // Add or update note: if note with same title exists, update its data (content, date, label), else add new note
    const addOrUpdateNote = () => {
        if (modalTitle.trim() && modalContent.trim()) {
            if (editingNoteId !== null) {
                // Update existing note by id
                setNotes(notes =>
                    notes.map(note =>
                        note.id === editingNoteId
                            ? {
                                ...note,
                                title: modalTitle.trim(),
                                content: modalContent.trim(),
                                date: modalDate,
                                label: modalLabel,
                            }
                            : note
                    )
                );
            } else {
                // Check if note with same title exists
                const existing = notes.find(note => note.title.trim() === modalTitle.trim());
                if (existing) {
                    // Update existing note's data (content, date, label)
                    setNotes(notes =>
                        notes.map(note =>
                            note.title.trim() === modalTitle.trim()
                                ? {
                                    ...note,
                                    content: modalContent.trim(),
                                    date: modalDate,
                                    label: modalLabel,
                                }
                                : note
                        )
                    );
                } else {
                    // Add new note
                    setNotes([
                        ...notes,
                        {
                            id: Date.now(),
                            title: modalTitle.trim(),
                            content: modalContent.trim(),
                            date: modalDate,
                            label: modalLabel,
                        },
                    ]);
                }
            }
            setModalTitle("");
            setModalContent("");
            setModalDate(new Date());
            setModalLabel([]);
            setModalOpen(false);
            setInputValue("");
            setEditingNoteId(null);
        }
    };

    // Click NoteCard to edit
    const handleNoteCardClick = (note: Note) => {
        setModalTitle(note.title);
        setModalContent(note.content);
        setModalDate(note.date);
        setModalLabel(note.label || []);
        setEditingNoteId(note.id);
        setModalOpen(true);
    };

    // Filter notes by search
    const filteredNotes = notes.filter(
        note =>
            note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="flex-1 relative">
            {/* Sticky header for desktop, sticky search for mobile */}
            <div
                className="sticky top-0 z-20 bg-white/60 dark:bg-gray-900/60 border-b dark:border-gray-700 flex items-center justify-between px-4 py-2 gap-2
                    md:flex-row md:gap-4
                    flex-col
                    md:h-16
                "
            >
                {/* Search always on top */}
                <div className="hidden md:flex md:w-1/2 md:justify-start">
                    <SearchInput value={search} onChange={setSearch} />
                </div>
                {/* NoteInput on right for desktop, hidden on mobile */}
                <div className="hidden md:flex md:w-1/2 md:justify-end">
                    <NoteInput
                        value={inputValue}
                        onChange={setInputValue}
                        onFocus={handleInputFocus}
                    />
                </div>
                {/* Mobile: show search on top */}
                <div className="md:hidden w-full mb-2">
                    <SearchInput value={search} onChange={setSearch} />
                </div>
            </div>
            {/* NoteInput sticky at bottom for mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/60 dark:bg-gray-900/60 border-t dark:border-gray-700 px-4 py-2 md:hidden">
                <NoteInput
                    value={inputValue}
                    onChange={setInputValue}
                    onFocus={handleInputFocus}
                />
            </div>

            {/* Modal */}
            <AddNoteModal
                open={modalOpen}
                title={modalTitle}
                content={modalContent}
                date={modalDate}
                label={modalLabel}
                onTitleChange={setModalTitle}
                onContentChange={setModalContent}
                onDateChange={setModalDate} // <-- allow to modify date
                onLabelChange={setModalLabel} // <-- allow to modify label
                onClose={handleModalClose}
                onAdd={addOrUpdateNote}
            />
            {/* 
                In AddNoteModal, make sure to add:
                - a date picker/input and call onDateChange when changed
                - a label input (e.g. tags or chips) and call onLabelChange when changed
            */}

            {/* Notes List */}
            <div
                className="columns-1 sm:columns-2 md:columns-3 gap-4 mt-4 mb-20 md:mb-4 [column-fill:_balance]"
            >
                {filteredNotes.map(note => (
                    <div key={note.id} className="break-inside-avoid mb-4">
                        <NoteCard note={note} onClick={() => handleNoteCardClick(note)} />
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Dashboard;