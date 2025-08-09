import { useState, useEffect, useRef, useCallback } from "react";
import { Note } from "../../models/Note";
import { NoteStore } from "../../models/store/NoteStore";
import { PinStore } from "../../models/store/PinStore";

const PAGE_SIZE = 8;

export function useDashboardNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [pinnedNotes, setPinnedNotes] = useState<Note[]>([]);
    const [showPinned, setShowPinned] = useState(true);
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
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        setIsSetPin(!PinStore.hasPin());
        setPinModalOpen(true);
    }, []);

    useEffect(() => {
        if (!pin) return;
        let loadedNotes: Note[] = [];
        let more = true;
        if (search.trim()) {
            // Try to filter by title and label
            const searchLower = search.trim().toLowerCase();
            // If NoteStore.filter supports label, use it, otherwise filter manually
            loadedNotes = NoteStore.getAll(pin)
                .filter(note =>
                    note.title.toLowerCase().includes(searchLower) ||
                    (Array.isArray(note.label) && note.label.some(l => l.toLowerCase().includes(searchLower)))
                )
                .slice(0, page * PAGE_SIZE);
            more = loadedNotes.length === page * PAGE_SIZE;
        } else {
            loadedNotes = NoteStore.getAll(pin).slice(0, page * PAGE_SIZE);
            more = loadedNotes.length === page * PAGE_SIZE;
        }
        const pinned = loadedNotes.filter(n => n.pinned);
        const unpinned = loadedNotes.filter(n => !n.pinned);
        setPinnedNotes(pinned);
        setNotes(unpinned);
        setHasMore(more);
    }, [search, modalOpen, pin, page, refreshKey]);

    const handlePinNote = useCallback((note: Note) => {
        if (!pin) return;
        const updatedNote = { ...note, pinned: !note.pinned };
        NoteStore.update(updatedNote, pin);
        setRefreshKey(k => k + 1);
        setSnackbar({ open: true, message: updatedNote.pinned ? "Note pinned!" : "Note unpinned!" });
    }, [pin]);

    useEffect(() => {
        setPage(1);
    }, [search, pin, modalOpen]);

    useEffect(() => {
        if (!hasMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new window.IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 1 }
        );
        if (loaderRef.current) observer.current.observe(loaderRef.current);
        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [hasMore, loaderRef.current]);

    const handleInputFocus = useCallback(() => {
        setModalTitle(inputValue);
        setModalContent("");
        setModalDate(new Date());
        setModalLabel([]);
        setEditingNoteId(null);
        setModalOpen(true);
    }, [inputValue]);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
        setInputValue("");
        setEditingNoteId(null);
    }, []);

    const addOrUpdateNote = useCallback(() => {
        if (!pin) return;
        if (modalTitle.trim() && modalContent.trim()) {
            // Always get all notes from storage to preserve pin status, even if filtered out
            const allNotesFromStore = NoteStore.getAll(pin);
            if (editingNoteId !== null) {
                const prevNote = allNotesFromStore.find(note => note.id === editingNoteId);
                const note: Note = {
                    id: editingNoteId,
                    title: modalTitle.trim(),
                    content: modalContent.trim(),
                    date: modalDate,
                    label: modalLabel,
                    pinned: prevNote?.pinned ?? false,
                };
                NoteStore.update(note, pin);
            } else {
                const existing = allNotesFromStore.find(note => note.title.trim() === modalTitle.trim());
                if (existing) {
                    const updatedNote: Note = {
                        ...existing,
                        content: modalContent.trim(),
                        date: modalDate,
                        label: modalLabel,
                        pinned: existing.pinned ?? false,
                    };
                    NoteStore.update(updatedNote, pin);
                } else {
                    const newNote: Note = {
                        id: Date.now(),
                        title: modalTitle.trim(),
                        content: modalContent.trim(),
                        date: modalDate,
                        label: modalLabel,
                        pinned: false,
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
            setPage(1);
            setRefreshKey(k => k + 1);
        }
    }, [pin, modalTitle, modalContent, modalDate, modalLabel, editingNoteId]);

    const handleNoteCardClick = useCallback((note: Note) => {
        setModalTitle(note.title);
        setModalContent(note.content);
        setModalDate(note.date);
        setModalLabel(note.label || []);
        setEditingNoteId(note.id);
        setModalOpen(true);
    }, []);

    const handleDuplicateNote = useCallback((note: Note) => {
        if (!pin) return;
        const baseTitle = note.title;
        const regex = new RegExp(`^${baseTitle}( copy( \((\d+)\))?)?$`);
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
        setPage(1);
        setRefreshKey(k => k + 1);
        setSnackbar({ open: true, message: "Note duplicated successfully!" });
    }, [pin, notes]);

    const handleDeleteNote = useCallback((id: number) => {
        setDeleteConfirm({ open: true, noteId: id });
    }, []);

    const confirmDelete = useCallback(() => {
        if (!pin) return;
        if (deleteConfirm.noteId !== null) {
            NoteStore.delete(deleteConfirm.noteId, pin);
            setPage(1);
            setRefreshKey(k => k + 1);
            setSnackbar({ open: true, message: "Note deleted permanently." });
        }
        setDeleteConfirm({ open: false, noteId: null });
    }, [pin, deleteConfirm.noteId]);

    const cancelDelete = useCallback(() => {
        setDeleteConfirm({ open: false, noteId: null });
    }, []);

    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(() => setSnackbar({ open: false, message: "" }), 2500);
            return () => clearTimeout(timer);
        }
    }, [snackbar.open]);

    const handlePinSubmit = useCallback((enteredPin: string) => {
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
    }, [isSetPin]);

    return {
        notes,
        pinnedNotes,
        showPinned,
        setShowPinned,
        inputValue,
        setInputValue,
        modalOpen,
        setModalOpen,
        modalTitle,
        setModalTitle,
        modalContent,
        setModalContent,
        modalDate,
        setModalDate,
        modalLabel,
        setModalLabel,
        editingNoteId,
        setEditingNoteId,
        search,
        setSearch,
        deleteConfirm,
        setDeleteConfirm,
        snackbar,
        setSnackbar,
        pinModalOpen,
        setPinModalOpen,
        pin,
        setPin,
        isSetPin,
        setIsSetPin,
        page,
        setPage,
        hasMore,
        setHasMore,
        loaderRef,
        refreshKey,
        setRefreshKey,
        observer,
        handlePinNote,
        handleInputFocus,
        handleModalClose,
        addOrUpdateNote,
        handleNoteCardClick,
        handleDuplicateNote,
        handleDeleteNote,
        confirmDelete,
        cancelDelete,
        handlePinSubmit,
    };
}
