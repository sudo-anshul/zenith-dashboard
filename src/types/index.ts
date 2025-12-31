export interface Task {
    id: string;
    text: string;
    isCompleted: boolean;
    createdAt: number;
}

export interface DayStats {
    date: string; // YYYY-MM-DD
    completed: number;
    total: number;
}

export interface AppData {
    tasks: Task[];
    history: Record<string, DayStats>; // Keyed by date string
    lastActiveDate: string;
}
