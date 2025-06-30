'use client'
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Note } from "../../models/Note";
import NoteCard from "./NoteCard";
import AddNoteModal from "./AddNoteModal";
import NoteInput from "./NoteInput";
import SearchInput from "./SearchInput";
import { NoteStore } from "../../models/store/NoteStore";
import { PinStore } from "../../models/store/PinStore";
import PinModal from "./PinModal";

const PAGE_SIZE = 8;

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
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; noteId: number | null }>({ open: false, noteId: null });
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: "" });
    const [pinModalOpen, setPinModalOpen] = useState(true);
    const [pin, setPin] = useState<string>("");
    const [isSetPin, setIsSetPin] = useState(false);

    // Infinite scroll state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    // On mount, check if pin is set
    useEffect(() => {
        setIsSetPin(!PinStore.hasPin());
        setPinModalOpen(true);
    }, []);

    // Load notes from NoteStore (filtered) with pagination
    useEffect(() => {
        if (!pin) return;
        let loadedNotes: Note[] = [];
        let more = true;
        if (search.trim()) {
            loadedNotes = NoteStore.filter(
                { title: search },
                pin,
                1,
                page * PAGE_SIZE
            );
            more = loadedNotes.length === page * PAGE_SIZE;
        } else {
            loadedNotes = NoteStore.getAll(pin).slice(0, page * PAGE_SIZE);
            more = loadedNotes.length === page * PAGE_SIZE;
        }
        setNotes(loadedNotes);
        setHasMore(more);
    }, [search, modalOpen, pin, page]);

    // Reset page when search or pin changes
    useEffect(() => {
        setPage(1);
    }, [search, pin, modalOpen]);

    // Infinite scroll observer
    useEffect(() => {
        if (!hasMore) return;
        const observer = new window.IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 1 }
        );
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [hasMore, loaderRef.current]);

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
        if (!pin) return;
        if (modalTitle.trim() && modalContent.trim()) {
            if (editingNoteId !== null) {
                const note: Note = {
                    id: editingNoteId,
                    title: modalTitle.trim(),
                    content: modalContent.trim(),
                    date: modalDate,
                    label: modalLabel,
                };
                NoteStore.update(note, pin);
            } else {
                const existing = notes.find(note => note.title.trim() === modalTitle.trim());
                if (existing) {
                    const updatedNote: Note = {
                        ...existing,
                        content: modalContent.trim(),
                        date: modalDate,
                        label: modalLabel,
                    };
                    NoteStore.update(updatedNote, pin);
                } else {
                    const newNote: Note = {
                        id: Date.now(),
                        title: modalTitle.trim(),
                        content: modalContent.trim(),
                        date: modalDate,
                        label: modalLabel,
                    };
                    NoteStore.insert(newNote, pin);
                }
            }
            setModalTitle("");
            setModalContent("");
            setModalDate(new Date());
            setModalLabel([]);
            setModalOpen(false);
            setInputValue("");
            setEditingNoteId(null);
            setPage(1); // reload from first page
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

    // Duplicate note with title append "copy (n)"
    const handleDuplicateNote = (note: Note) => {
        if (!pin) return;
        const baseTitle = note.title;
        const regex = new RegExp(`^${baseTitle}( copy( \\((\\d+)\\))?)?$`);
        const matches = notes
            .map(n => n.title)
            .filter(title => regex.test(title));

        let copyNumber = 1;
        if (matches.length > 0) {
            const numbers = matches
                .map(title => {
                    const match = title.match(/ copy(?: \((\d+)\))?$/);
                    return match ? parseInt(match[1] || "1", 10) : 0;
                });
            copyNumber = Math.max(1, ...numbers) + 1;
        }
        const newTitle = matches.length === 0
            ? `${baseTitle} copy`
            : `${baseTitle} copy (${copyNumber})`;

        const newNote: Note = {
            ...note,
            id: Date.now(),
            title: newTitle,
            date: new Date(),
        };
        NoteStore.insert(newNote, pin);
        setPage(1); // reload from first page
        setSnackbar({ open: true, message: "Note duplicated successfully!" });
    };

    // Delete note with confirmation
    const handleDeleteNote = (id: number) => {
        setDeleteConfirm({ open: true, noteId: id });
    };

    const confirmDelete = () => {
        if (!pin) return;
        if (deleteConfirm.noteId !== null) {
            NoteStore.delete(deleteConfirm.noteId, pin);
            setPage(1); // reload from first page
            setSnackbar({ open: true, message: "Note deleted permanently." });
        }
        setDeleteConfirm({ open: false, noteId: null });
    };

    const cancelDelete = () => {
        setDeleteConfirm({ open: false, noteId: null });
    };

    // Snackbar auto-hide
    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(() => setSnackbar({ open: false, message: "" }), 2500);
            return () => clearTimeout(timer);
        }
    }, [snackbar.open]);

    // Handle PIN modal submit
    const handlePinSubmit = (enteredPin: string) => {
        if (isSetPin) {
            PinStore.setPin(enteredPin);
            setPin(enteredPin);
            setPinModalOpen(false);
        } else {
            if (PinStore.verifyPin(enteredPin)) {
                setPin(enteredPin);
                setPinModalOpen(false);
            } else {
                setSnackbar({ open: true, message: "Incorrect PIN. Please try again." });
            }
        }
    };

    return (
        <main className="flex-1 relative">
            <PinModal open={pinModalOpen} onSubmit={handlePinSubmit} isSetPin={isSetPin} />
            {/* Sticky header for desktop, sticky search for mobile */}
            <div
                className="sticky top-0 z-20 bg-white/60 dark:bg-gray-900/60 border-b border-emerald-600 dark:border-emerald-400
                    flex items-center justify-between px-1 py-2 gap-2
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
            <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/60 dark:bg-gray-900/60 border-t border-emerald-600 dark:border-emerald-400 px-4 py-2 md:hidden">
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

            {/* Delete Confirmation Modal */}
            {deleteConfirm.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
                        <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Delete Note
                        </div>
                        <div className="mb-4 text-gray-700 dark:text-gray-300">
                            Are you sure you want to delete this note? <br />
                            <span className="font-semibold text-red-600">This action is permanent and cannot be restored.</span>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Snackbar */}
            {snackbar.open && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-emerald-600 text-white px-6 py-3 rounded shadow-lg text-center min-w-[200px]">
                        {snackbar.message}
                    </div>
                </div>
            )}

            {/* Notes List */}
            <div
                className="columns-1 sm:columns-2 md:columns-3 gap-4 mt-4 mb-20 md:mb-4 [column-fill:_balance]"
            >
                {notes.map(note => (
                    <div key={note.id} className="break-inside-avoid mb-4">
                        <NoteCard
                            note={note}
                            onClick={() => handleNoteCardClick(note)}
                            onDuplicate={() => handleDuplicateNote(note)}
                            onDelete={() => handleDeleteNote(note.id)}
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
        </main>
    );
};

export default Dashboard;