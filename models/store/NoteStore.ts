import CryptoJS from "crypto-js";
import { Note } from "../Note";

type NoteIndex = {
    id: number;
    title: string;
    date: string; // ISO string for easier storage
    label: string[];
};

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
const STORAGE_KEY =process.env.STORAGE_KEY || "encrypted_notes";
const INDEX_KEY = process.env.INDEX_KEY ||"notes_index";

function encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

function decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

function loadIndex(): NoteIndex[] {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveIndex(index: NoteIndex[]): void {
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

function loadEncryptedNotes(): Record<number, string> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

function saveEncryptedNotes(notes: Record<number, string>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function noteToIndex(note: Note): NoteIndex {
    return {
        id: note.id,
        title: note.title,
        date: note.date.toISOString(),
        label: note.label,
    };
}

function getNoteById(id: number): Note | null {
    const encryptedNotes = loadEncryptedNotes();
    const encrypted = encryptedNotes[id];
    if (!encrypted) return null;
    try {
        const decrypted = decrypt(encrypted);
        const note = JSON.parse(decrypted, (key, value) =>
            key === "date" ? new Date(value) : value
        );
        return note;
    } catch {
        return null;
    }
}

export const NoteStore = {
    insert(note: Note): void {
        const index = loadIndex();
        const encryptedNotes = loadEncryptedNotes();
        index.push(noteToIndex(note));
        encryptedNotes[note.id] = encrypt(JSON.stringify(note));
        saveIndex(index);
        saveEncryptedNotes(encryptedNotes);
    },

    update(note: Note): void {
        let index = loadIndex();
        let encryptedNotes = loadEncryptedNotes();
        index = index.map(n => n.id === note.id ? noteToIndex(note) : n);
        encryptedNotes[note.id] = encrypt(JSON.stringify(note));
        saveIndex(index);
        saveEncryptedNotes(encryptedNotes);
    },

    delete(id: number): void {
        let index = loadIndex();
        let encryptedNotes = loadEncryptedNotes();
        index = index.filter(n => n.id !== id);
        delete encryptedNotes[id];
        saveIndex(index);
        saveEncryptedNotes(encryptedNotes);
    },

    filter(
        query: {
            title?: string;
            content?: string;
            date?: Date;
            label?: string;
        },
        page: number = 1,
        pageSize: number = 10
    ): Note[] {
        let index = loadIndex();
        // Filter using index (fast, no decryption)
        index = index.filter(note => {
            const matchTitle = query.title ? note.title.toLowerCase().includes(query.title.toLowerCase()) : true;
            const matchDate = query.date ? new Date(note.date).toDateString() === query.date.toDateString() : true;
            const matchLabel = query.label ? note.label.includes(query.label) : true;
            return matchTitle && matchDate && matchLabel;
        });
        // If content filter is needed, decrypt only those notes
        let notes: Note[] = [];
        if (query.content) {
            for (const idx of index) {
                const note = getNoteById(idx.id);
                if (note && note.content.toLowerCase().includes(query.content.toLowerCase())) {
                    notes.push(note);
                }
            }
        } else {
            notes = index.map(idx => {
                const note = getNoteById(idx.id);
                return note!;
            }).filter(Boolean) as Note[];
        }
        notes = notes.sort((a, b) => b.date.getTime() - a.date.getTime());
        // Pagination
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return notes.slice(start, end);
    },

    clone(id: number): Note | null {
        const note = getNoteById(id);
        if (!note) return null;
        const newNote: Note = {
            ...note,
            id: Date.now(),
            date: new Date(),
        };
        this.insert(newNote);
        return newNote;
    },

    getAll(): Note[] {
        const index = loadIndex();
        return index.map(idx => getNoteById(idx.id)!).filter(Boolean).sort((a, b) => b.date.getTime() - a.date.getTime());
    },


    getById(id: number): Note | null {
        return getNoteById(id);
    }
};