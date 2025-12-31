import { useLocalStorage } from './useLocalStorage';
import type { Task, AppData } from '../types';

const STORAGE_KEY = 'startup-page-data';

const getTodayString = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

const INITIAL_DATA: AppData = {
    tasks: [],
    history: {},
    lastActiveDate: getTodayString(),
};

export function useTaskManager() {
    const [data, setData] = useLocalStorage<AppData>(STORAGE_KEY, INITIAL_DATA);

    // Daily Rollover Logic
    const checkDailyRollover = () => {
        const today = getTodayString();
        if (data.lastActiveDate !== today) {
            const yesterday = data.lastActiveDate;
            const completedCount = data.tasks.filter(t => t.isCompleted).length;
            const totalCount = data.tasks.length;

            // Keep incomplete tasks, archive completed ones
            const activeTasks = data.tasks.filter(t => !t.isCompleted);

            setData(prev => ({
                ...prev,
                history: {
                    ...prev.history,
                    [yesterday]: { date: yesterday, completed: completedCount, total: totalCount }
                },
                tasks: activeTasks,
                lastActiveDate: today,
            }));
        }
    };

    if (data.lastActiveDate !== getTodayString()) {
        checkDailyRollover();
    }

    const addTask = (text: string) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            text,
            isCompleted: false,
            createdAt: Date.now(),
        };
        setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    };

    const toggleTask = (id: string) => {
        setData(prev => ({
            ...prev,
            tasks: prev.tasks.map(t =>
                t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
            )
        }));
    };

    const editTask = (id: string, newText: string) => {
        setData(prev => ({
            ...prev,
            tasks: prev.tasks.map(t =>
                t.id === id ? { ...t, text: newText } : t
            )
        }));
    };

    const deleteTask = (id: string) => {
        setData(prev => ({
            ...prev,
            tasks: prev.tasks.filter(t => t.id !== id)
        }));
    };

    // Stats for displaying progress
    const completedCount = data.tasks.filter(t => t.isCompleted).length;
    const totalCount = data.tasks.length;

    return {
        tasks: data.tasks,
        history: data.history,
        completedCount,
        totalCount,
        addTask,
        toggleTask,
        editTask,
        deleteTask,
    };
}
