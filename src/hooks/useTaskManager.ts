import { useEffect } from 'react';
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

    // Daily Rollover Logic - Now safely inside useEffect
    useEffect(() => {
        const today = getTodayString();
        if (data.lastActiveDate !== today) {
            const yesterday = data.lastActiveDate;
            const completedCount = data.tasks.filter(t => t.isCompleted).length;
            const totalCount = data.tasks.length;

            const nextTasks = data.tasks.reduce((acc: Task[], task) => {
                if (task.type === 'habit' || !task.type) {
                    if (task.isCompleted) {
                        const history = task.completionHistory ? [...task.completionHistory, yesterday] : [yesterday];
                        acc.push({ ...task, isCompleted: false, completionHistory: history });
                    } else {
                        acc.push(task);
                    }
                } else {
                    if (!task.isCompleted) {
                        acc.push(task);
                    }
                }
                return acc;
            }, []);

            setData(prev => ({
                ...prev,
                history: {
                    ...prev.history,
                    [yesterday]: { date: yesterday, completed: completedCount, total: totalCount }
                },
                tasks: nextTasks,
                lastActiveDate: today,
            }));
        }
    }, [data.lastActiveDate, data.tasks, setData]);

    const addTask = (text: string, type: 'task' | 'habit' = 'habit') => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            text,
            isCompleted: false,
            createdAt: Date.now(),
            type,
            completionHistory: []
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
