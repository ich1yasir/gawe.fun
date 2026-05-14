export type Note = {
    id: number;
    title: string;
    content: string;
    date: Date;
    label: string[];
    pinned?: boolean;
};