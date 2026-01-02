import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useSupabase } from '../context/SupabaseContext';
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
    const { supabase, session } = useSupabase();

    // 1. Sync from Cloud on Load
    useEffect(() => {
        if (!supabase || !session) return;

        const fetchData = async () => {
            // Fetch Tasks
            const { data: cloudTasks, error } = await supabase
                .from('tasks')
                .select('*');

            if (error) {
                console.error('Error fetching tasks:', error);
                return;
            }

            if (cloudTasks) {
                if (cloudTasks.length > 0) {
                    const mappedTasks: Task[] = cloudTasks.map(t => ({
                        id: t.id,
                        text: t.text,
                        isCompleted: t.is_completed,
                        createdAt: t.created_at,
                        type: t.type as 'task' | 'habit',
                        completionHistory: t.completion_history
                    }));

                    setData(prev => ({ ...prev, tasks: mappedTasks }));
                }
            }
        };

        fetchData();
    }, [session, supabase, setData]);


    // Daily Rollover Logic
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


    // Helper to update cloud
    const syncTaskToCloud = async (task: Task, action: 'UPSERT' | 'DELETE' = 'UPSERT') => {
        if (!supabase || !session) return;

        if (action === 'DELETE') {
            await supabase.from('tasks').delete().eq('id', task.id);
        } else {
            await supabase.from('tasks').upsert({
                id: task.id,
                user_id: session.user.id,
                text: task.text,
                is_completed: task.isCompleted,
                created_at: task.createdAt,
                type: task.type,
                completion_history: task.completionHistory
            });
        }
    };


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
        syncTaskToCloud(newTask, 'UPSERT');
    };

    const toggleTask = (id: string) => {
        let updatedTask: Task | undefined;

        setData(prev => {
            const nextTasks = prev.tasks.map(t => {
                if (t.id === id) {
                    updatedTask = { ...t, isCompleted: !t.isCompleted };
                    return updatedTask;
                }
                return t;
            });
            return { ...prev, tasks: nextTasks };
        });

        if (updatedTask) {
            syncTaskToCloud(updatedTask!, 'UPSERT');
        }
    };

    const deleteTask = (id: string) => {
        const taskToDelete = data.tasks.find(t => t.id === id);

        setData(prev => ({
            ...prev,
            tasks: prev.tasks.filter(t => t.id !== id)
        }));

        if (taskToDelete) {
            syncTaskToCloud(taskToDelete, 'DELETE');
        }
    };

    const editTask = (id: string, newText: string) => {
        let updatedTask: Task | undefined;

        setData(prev => {
            const nextTasks = prev.tasks.map(t => {
                if (t.id === id) {
                    updatedTask = { ...t, text: newText };
                    return updatedTask;
                }
                return t;
            });
            return { ...prev, tasks: nextTasks };
        });

        if (updatedTask) {
            syncTaskToCloud(updatedTask!, 'UPSERT');
        }
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
        deleteTask,
        editTask
    };
}
