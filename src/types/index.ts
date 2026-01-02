export interface Task {
    id: string;
    text: string;
    isCompleted: boolean;
    createdAt: number;
    type: 'task' | 'habit';
    completionHistory?: string[]; // Date strings YYYY-MM-DD for habits
}

export interface DayStats {
    date: string; // YYYY-MM-DD
    completed: number;
    total: number;
}

export interface JournalEntry {
    id: string;
    date: string; // YYYY-MM-DD
    content: string;
    lastUpdated: number;
}

export interface AppData {
    tasks: Task[];
    history: Record<string, DayStats>; // Keyed by date string
    lastActiveDate: string;
}
