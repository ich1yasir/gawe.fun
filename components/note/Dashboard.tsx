'use client'
import React, { useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
};

const initialNotes: Note[] = [
  { id: 1, title: "Shopping List", content: "Milk, Bread, Eggs" },
  { id: 2, title: "Ideas", content: "Build a dashboard app" },
];

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addNote = () => {
    if (title.trim() && content.trim()) {
      setNotes([
        ...notes,
        { id: Date.now(), title: title.trim(), content: content.trim() },
      ]);
      setTitle("");
      setContent("");
    }
  };

  return (
      <main className="flex-1">
        {/* Add Note */}
        <div className="bg-white p-4 rounded-lg shadow mb-8 max-w-md">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <textarea
            placeholder="Take a note..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded resize-y min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={addNote}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Note
          </button>
        </div>

        {/* Notes List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {notes.map(note => (
            <div
              key={note.id}
              className="bg-white p-4 rounded-lg shadow min-h-[100px]"
            >
              <strong className="block text-lg">{note.title}</strong>
              <p className="mt-2 text-gray-700">{note.content}</p>
            </div>
          ))}
        </div>
      </main>
  );
};

export default Dashboard;
