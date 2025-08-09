import CryptoJS from "crypto-js";
import { Note } from "../Note";
import { PinStore } from "./PinStore";

type NoteIndex = {
    id: number;
    title: string;
    date: string; // ISO string for easier storage
    label: string[];
};

const STORAGE_KEY = process.env.STORAGE_KEY || "encrypted_notes";
const INDEX_KEY = process.env.INDEX_KEY || "notes_index";

function getEncryptionKey(pin: string) {
    // Use a static key + hashed pin for encryption
    const staticKey = process.env.ENCRYPTION_KEY || "default_key";
    const pinHash = CryptoJS.SHA256(pin).toString();
    return staticKey + pinHash;
}

function encrypt(data: string, pin: string): string {
    return CryptoJS.AES.encrypt(data, getEncryptionKey(pin)).toString();
}

function decrypt(ciphertext: string, pin: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, getEncryptionKey(pin));
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

function getNoteById(id: number, pin: string): Note | null {
    const encryptedNotes = loadEncryptedNotes();
    const encrypted = encryptedNotes[id];
    if (!encrypted) return null;
    try {
        const decrypted = decrypt(encrypted, pin);
        const note = JSON.parse(decrypted, (key, value) =>
            key === "date" ? new Date(value) : value
        );
        return note;
    } catch {
        return null;
    }
}

export const NoteStore = {
    insert(note: Note, pin: string): void {
        const index = loadIndex();
        const encryptedNotes = loadEncryptedNotes();
        index.push(noteToIndex(note));
        encryptedNotes[note.id] = encrypt(JSON.stringify(note), pin);
        saveIndex(index);
        saveEncryptedNotes(encryptedNotes);
    },

    update(note: Note, pin: string): void {
        let index = loadIndex();
        let encryptedNotes = loadEncryptedNotes();
        index = index.map(n => n.id === note.id ? noteToIndex(note) : n);
        encryptedNotes[note.id] = encrypt(JSON.stringify(note), pin);
        saveIndex(index);
        saveEncryptedNotes(encryptedNotes);
    },

    delete(id: number, pin: string): void {
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
        pin: string,
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
                const note = getNoteById(idx.id, pin);
                if (note && note.content.toLowerCase().includes(query.content.toLowerCase())) {
                    notes.push(note);
                }
            }
        } else {
            notes = index.map(idx => {
                const note = getNoteById(idx.id, pin);
                return note!;
            }).filter(Boolean) as Note[];
        }
        notes = notes.sort((a, b) => b.date.getTime() - a.date.getTime());
        // Pagination
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return notes.slice(start, end);
    },

    clone(id: number, pin: string): Note | null {
        const note = getNoteById(id, pin);
        if (!note) return null;
        const newNote: Note = {
            ...note,
            id: Date.now(),
            date: new Date(),
        };
        this.insert(newNote, pin);
        return newNote;
    },

    getAll(pin: string): Note[] {
        const index = loadIndex();
        return index.map(idx => getNoteById(idx.id, pin)!).filter(Boolean).sort((a, b) => b.date.getTime() - a.date.getTime());
    },

    getById(id: number, pin: string): Note | null {
        return getNoteById(id, pin);
    }
};