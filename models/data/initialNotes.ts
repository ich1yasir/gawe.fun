import { Note } from "../Note";

const initialNotes: Note[] = [
    {
        id: 1,
        title: "Grocery Shopping",
        content: "Milk, Bread, Eggs",
        date: new Date("2024-06-01T09:30:00"),
        label: ["personal", "shopping"]
    },
    {
        id: 2,
        title: "Team Brainstorming Session",
        content: `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.`,
        date: new Date("2024-06-02T14:15:00"),
        label: ["work", "brainstorm"]
    },
    {
        id: 3,
        title: "Quick Meeting Notes",
        content: "Short note.",
        date: new Date("2024-06-03T10:00:00"),
        label: ["quick", "work"]
    },
    {
        id: 4,
        title: "Dashboard App Feature List",
        content: "Build a dashboard app",
        date: new Date("2024-06-04T08:45:00"),
        label: ["project", "development"]
    },
    {
        id: 5,
        title: "Fitness Goals",
        content: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
        date: new Date("2024-06-05T16:20:00"),
        label: ["personal"]
    },
    {
        id: 6,
        title: "Analytics Dashboard Ideas",
        content: "Build a dashboard app with analytics and charts.",
        date: new Date("2024-06-06T11:10:00"),
        label: ["project", "analytics"]
    },
    {
        id: 7,
        title: "Explore React 19 Features",
        content: "Try out new React features.",
        date: new Date("2024-06-07T13:00:00"),
        label: ["learning", "react"]
    },
    {
        id: 8,
        title: "UI Design Inspiration",
        content: "Build a dashboard app",
        date: new Date("2024-06-08T09:00:00"),
        label: ["project"]
    },
    {
        id: 9,
        title: "TypeScript Generics Research",
        content: "Research about TypeScript generics and utility types.",
        date: new Date("2024-06-09T15:30:00"),
        label: ["learning", "typescript"]
    },
    {
        id: 10,
        title: "Project Roadmap",
        content: "Build a dashboard app",
        date: new Date("2024-06-10T17:45:00"),
        label: ["project"]
    },
    {
        id: 11,
        title: "Weekend Trip Planning",
        content: "Plan weekend trip.",
        date: new Date("2024-06-11T12:00:00"),
        label: ["personal", "travel"]
    },
    {
        id: 12,
        title: "Feature Backlog",
        content: "Build a dashboard app",
        date: new Date("2024-06-12T18:10:00"),
        label: ["project"]
    },
    {
        id: 13,
        title: "React Hooks Blog Outline",
        content: "Write a blog post about React hooks.",
        date: new Date("2024-06-13T07:50:00"),
        label: ["writing", "react"]
    },
    {
        id: 14,
        title: "Release Checklist",
        content: "Build a dashboard app",
        date: new Date("2024-06-14T20:00:00"),
        label: ["project"]
    },
    {
        id: 15,
        title: "Comprehensive Meeting Summary",
        content: "Long note. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque.",
        date: new Date("2024-06-15T21:30:00"),
        label: ["notes", "long"]
    },
    {
        id: 16,
        title: "Sprint Planning",
        content: "Build a dashboard app",
        date: new Date("2024-06-16T22:15:00"),
        label: ["project"]
    },
    {
        id: 17,
        title: "Reminder: Submit Report",
        content: "Quick reminder.",
        date: new Date("2024-06-17T23:00:00"),
        label: ["reminder"]
    },
    {
        id: 18,
        title: "UI Component Refactor",
        content: "Build a dashboard app",
        date: new Date("2024-06-18T08:30:00"),
        label: ["project"]
    },
    {
        id: 19,
        title: "Short Note",
        content: "Short.",
        date: new Date("2024-06-19T09:45:00"),
        label: ["quick"]
    },
    {
        id: 20,
        title: "Authentication & Real-time Features",
        content: "Build a dashboard app with authentication, user roles, and real-time updates. Consider using Next.js and Tailwind CSS for rapid development.",
        date: new Date("2024-06-20T10:20:00"),
        label: ["project", "feature", "nextjs"]
    },
];

export default initialNotes