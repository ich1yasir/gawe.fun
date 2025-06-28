'use client'
import React, { useState, useRef, useEffect } from "react";
import { Note } from "../../models/Note";
import NoteCard from "./NoteCard";
import AddNoteModal from "./AddNoteModal";
import NoteInput from "./NoteInput";
import SearchInput from "./SearchInput";
import { NoteStore } from "../../models/store/NoteStore";

const Dashboard: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");
    const [modalDate, setModalDate] = useState<Date>(new Date());
    const [modalLabel, setModalLabel] = useState<string[]>([]);
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Load notes from NoteStore (filtered)
    useEffect(() => {
        if (search.trim()) {
            // Filter by title or content
            const filtered = NoteStore.filter({
                // title: search,
                content: search
            }, 1, 100);
            setNotes(filtered);
        } else {
            setNotes(NoteStore.getAll());
        }
    }, [search, modalOpen]);

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

    // Add or update note using NoteStore
    const addOrUpdateNote = () => {
        if (modalTitle.trim() && modalContent.trim()) {
            if (editingNoteId !== null) {
                // Update existing note by id
                const note: Note = {
                    id: editingNoteId,
                    title: modalTitle.trim(),
                    content: modalContent.trim(),
                    date: modalDate,
                    label: modalLabel,
                };
                NoteStore.update(note);
            } else {
                // Check if note with same title exists
                const existing = notes.find(note => note.title.trim() === modalTitle.trim());
                if (existing) {
                    // Update existing note's data (content, date, label)
                    const updatedNote: Note = {
                        ...existing,
                        content: modalContent.trim(),
                        date: modalDate,
                        label: modalLabel,
                    };
                    NoteStore.update(updatedNote);
                } else {
                    // Add new note
                    const newNote: Note = {
                        id: Date.now(),
                        title: modalTitle.trim(),
                        content: modalContent.trim(),
                        date: modalDate,
                        label: modalLabel,
                    };
                    NoteStore.insert(newNote);
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

    // Optionally, add a delete handler if you want to support deleting notes
    const handleDeleteNote = (id: number) => {
        NoteStore.delete(id);
        setNotes(NoteStore.getAll());
    };

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
                onDateChange={setModalDate}
                onLabelChange={setModalLabel}
                onClose={handleModalClose}
                onAdd={addOrUpdateNote}
            />

            {/* Notes List */}
            <div
                className="columns-1 sm:columns-2 md:columns-3 gap-4 mt-4 mb-20 md:mb-4 [column-fill:_balance]"
            >
                {notes.map(note => (
                    <div key={note.id} className="break-inside-avoid mb-4">
                        <NoteCard note={note} onClick={() => handleNoteCardClick(note)} />
                        {/* Optionally add a delete button here and call handleDeleteNote(note.id) */}
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Dashboard;