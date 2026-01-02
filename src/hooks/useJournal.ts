
import { useLocalStorage } from './useLocalStorage';
import type { JournalEntry } from '../types';

const STORAGE_KEY = 'startup-page-journal';

export function useJournal() {
    const [entries, setEntries] = useLocalStorage<JournalEntry[]>(STORAGE_KEY, []);

    const saveEntry = (content: string, date: string = new Date().toLocaleDateString('en-CA')) => {
        setEntries(prev => {
            const existingIndex = prev.findIndex(e => e.date === date);
            if (existingIndex >= 0) {
                const newEntries = [...prev];
                newEntries[existingIndex] = {
                    ...newEntries[existingIndex],
                    content,
                    lastUpdated: Date.now()
                };
                return newEntries;
            } else {
                return [...prev, {
                    id: crypto.randomUUID(),
                    date,
                    content,
                    lastUpdated: Date.now()
                }];
            }
        });
    };

    const getEntry = (date: string = new Date().toLocaleDateString('en-CA')) => {
        return entries.find(e => e.date === date)?.content || '';
    };

    return {
        entries,
        saveEntry,
        getEntry
    };
}
