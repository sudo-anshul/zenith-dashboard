
import { useLocalStorage } from './useLocalStorage';
import type { JournalEntry } from '../types';

const STORAGE_KEY = 'startup-page-journal';

export function useJournal() {
    const [entries, setEntries] = useLocalStorage<JournalEntry[]>(STORAGE_KEY, []);

    const saveEntry = (
        content: string,
        date: string = new Date().toLocaleDateString('en-CA'),
        type: 'daily' | 'weekly' | 'monthly' | 'freeform' = 'freeform',
        questions?: { question: string; answer: string }[]
    ) => {
        setEntries(prev => {
            const existingIndex = prev.findIndex(e => e.date === date);
            if (existingIndex >= 0) {
                const newEntries = [...prev];
                newEntries[existingIndex] = {
                    ...newEntries[existingIndex],
                    content,
                    type,
                    questions,
                    lastUpdated: Date.now()
                };
                return newEntries;
            } else {
                return [...prev, {
                    id: crypto.randomUUID(),
                    date,
                    content,
                    type,
                    questions,
                    lastUpdated: Date.now()
                }];
            }
        });
    };

    const getEntry = (date: string = new Date().toLocaleDateString('en-CA')) => {
        return entries.find(e => e.date === date) || null;
    };

    return {
        entries,
        saveEntry,
        getEntry
    };
}
