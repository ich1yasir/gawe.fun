'use client'
import React from "react";
import { useDashboardNotes } from "./useDashboardNotes";
import DashboardNotes from "./DashboardNotes";
import AddNoteModal from "./AddNoteModal";
import NoteInput from "./NoteInput";
import SearchInput from "./SearchInput";
import { NoteStore } from "../../models/store/NoteStore";
import { PinStore } from "../../models/store/PinStore";
import PinModal from "./PinModal";
import LabelFilterDropdown from "./LabelFilterDropdown";


const Dashboard: React.FC = () => {
    const notesState = useDashboardNotes();
    // Collect all unique labels from all notes (pinned and unpinned)
    const allLabels = Array.from(new Set([
        ...notesState.pinnedNotes.flatMap(n => n.label || []),
        ...notesState.notes.flatMap(n => n.label || [])
    ])).filter(Boolean).sort((a, b) => a.localeCompare(b));
    const [selectedLabels, setSelectedLabels] = React.useState<string[]>([]);
    const [labelSearch, setLabelSearch] = React.useState("");

    // Filter notes by selected labels
    const filterByLabels = (noteList: typeof notesState.notes) => {
        if (selectedLabels.length === 0) return noteList;
        return noteList.filter(note =>
            Array.isArray(note.label) && selectedLabels.every(l => note.label.includes(l))
        );
    };

    // Filtered label options for dropdown search
    const filteredLabelOptions = allLabels.filter(l => l.toLowerCase().includes(labelSearch.toLowerCase()));

    const filteredPinnedNotes = filterByLabels(notesState.pinnedNotes);
    const filteredNotes = filterByLabels(notesState.notes);


    // Handle dropdown label selection
    const handleLabelDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setSelectedLabels(selected);
    };

    return (
        <main className="flex-1 relative">
            <PinModal open={notesState.pinModalOpen} onSubmit={notesState.handlePinSubmit} isSetPin={notesState.isSetPin} />
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
                    <SearchInput value={notesState.search} onChange={notesState.setSearch} />
                </div>
                {/* NoteInput on right for desktop, hidden on mobile */}
                <div className="hidden md:flex md:w-1/2 md:justify-end">
                    <NoteInput
                        value={notesState.inputValue}
                        onChange={notesState.setInputValue}
                        onFocus={notesState.handleInputFocus}
                    />
                </div>
                {/* Mobile: show search on top */}
                <div className="md:hidden w-full mb-2">
                    <SearchInput value={notesState.search} onChange={notesState.setSearch} />
                </div>
            </div>
            {/* NoteInput sticky at bottom for mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/60 dark:bg-gray-900/60 border-t border-emerald-600 dark:border-emerald-400 px-4 py-2 md:hidden">
                <div className="mr-14">
                    <NoteInput
                        value={notesState.inputValue}
                        onChange={notesState.setInputValue}
                        onFocus={notesState.handleInputFocus}
                    />
                </div>
            </div>

            {/* Modal */}
            <AddNoteModal
                open={notesState.modalOpen}
                title={notesState.modalTitle}
                content={notesState.modalContent}
                date={notesState.modalDate}
                label={notesState.modalLabel}
                onTitleChange={notesState.setModalTitle}
                onContentChange={notesState.setModalContent}
                onDateChange={notesState.setModalDate}
                onLabelChange={notesState.setModalLabel}
                onClose={notesState.handleModalClose}
                onAdd={notesState.addOrUpdateNote}
            />

            {/* Delete Confirmation Modal */}
            {notesState.deleteConfirm.open && (
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
                                onClick={notesState.cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                onClick={notesState.confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Snackbar */}
            {notesState.snackbar.open && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-emerald-600 text-white px-6 py-3 rounded shadow-lg text-center min-w-[200px]">
                        {notesState.snackbar.message}
                    </div>
                </div>
            )}

            {/* Label Filter Dropdown (multi-select, searchable) */}
            {/* Desktop: show inline, Mobile: show as FAB */}
            <div className="hidden md:block">
                <LabelFilterDropdown
                    allLabels={allLabels}
                    selectedLabels={selectedLabels}
                    setSelectedLabels={setSelectedLabels}
                    labelSearch={labelSearch}
                    setLabelSearch={setLabelSearch}
                />
            </div>
            {/* FAB for mobile */}
            <div className="md:hidden">
                <LabelFilterDropdown
                    allLabels={allLabels}
                    selectedLabels={selectedLabels}
                    setSelectedLabels={setSelectedLabels}
                    labelSearch={labelSearch}
                    setLabelSearch={setLabelSearch}
                    isFab
                />
            </div>
            {/* Notes List (pinned & unpinned) */}
            <DashboardNotes
                pinnedNotes={filteredPinnedNotes}
                notes={filteredNotes}
                showPinned={notesState.showPinned}
                setShowPinned={notesState.setShowPinned}
                handleNoteCardClick={notesState.handleNoteCardClick}
                handleDuplicateNote={notesState.handleDuplicateNote}
                handleDeleteNote={notesState.handleDeleteNote}
                handlePinNote={notesState.handlePinNote}
                loaderRef={notesState.loaderRef}
                hasMore={notesState.hasMore}
            />
        </main>
    );
};
export default Dashboard;