
import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useSupabase } from '../context/SupabaseContext';
import type { JournalEntry } from '../types';

const STORAGE_KEY = 'startup-page-journal';

export function useJournal() {
    const [entries, setEntries] = useLocalStorage<JournalEntry[]>(STORAGE_KEY, []);
    const { supabase, session } = useSupabase();

    // Sync from Cloud
    useEffect(() => {
        if (!supabase || !session) return;

        const fetchEntries = async () => {
            const { data: cloudEntries, error } = await supabase
                .from('journal_entries')
                .select('*');

            if (error) {
                console.error('Error fetching journal:', error);
                return;
            }

            if (cloudEntries && cloudEntries.length > 0) {
                const mappedEntries: JournalEntry[] = cloudEntries.map(e => ({
                    id: e.id,
                    date: e.date,
                    content: e.content,
                    lastUpdated: e.last_updated,
                    type: e.type as 'daily' | 'weekly' | 'monthly' | 'freeform',
                    questions: e.questions
                }));
                // Simple merge: replace local with cloud
                setEntries(mappedEntries);
            }
        };

        fetchEntries();
    }, [session, supabase, setEntries]);

    // Helper to sync to cloud
    const syncEntryToCloud = async (entry: JournalEntry) => {
        if (!supabase || !session) return;

        await supabase.from('journal_entries').upsert({
            id: entry.id,
            user_id: session.user.id,
            date: entry.date,
            content: entry.content,
            last_updated: entry.lastUpdated,
            type: entry.type,
            questions: entry.questions
        });
    };

    const saveEntry = (
        content: string,
        date: string = new Date().toLocaleDateString('en-CA'),
        type: 'daily' | 'weekly' | 'monthly' | 'freeform' = 'freeform',
        questions?: { question: string; answer: string }[]
    ) => {
        let savedEntry: JournalEntry | undefined;

        setEntries(prev => {
            const existingIndex = prev.findIndex(e => e.date === date);
            if (existingIndex >= 0) {
                const newEntries = [...prev];
                const updated = {
                    ...newEntries[existingIndex],
                    content,
                    type,
                    questions,
                    lastUpdated: Date.now()
                };
                newEntries[existingIndex] = updated;
                savedEntry = updated;
                return newEntries;
            } else {
                const newEntry = {
                    id: crypto.randomUUID(),
                    date,
                    content,
                    type,
                    questions,
                    lastUpdated: Date.now()
                };
                savedEntry = newEntry;
                return [...prev, newEntry];
            }
        });

        if (savedEntry) {
            syncEntryToCloud(savedEntry);
        }
    };

    const getEntry = (date: string = new Date().toLocaleDateString('en-CA')) => {
        return entries.find(e => e.date === date) || null;
    };

    return {
        entries, // Expose for list view
        saveEntry,
        getEntry
    };
}
