import { useState, useEffect } from 'react';
import { useJournal } from '../hooks/useJournal';
import { JournalSession } from './JournalSession';
import { getQuestionsForDate } from '../data/journalQuestions';
import { BookOpen, Calendar, ChevronDown, Plus, Clock } from 'lucide-react';
import type { QA } from '../types';

interface JournalViewProps {
    isDark: boolean;
}

export const JournalView = ({ isDark }: JournalViewProps) => {
    const { getEntry, saveEntry, entries = [] } = useJournal(); // Assuming entries is exposed from hook
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

    // Get today's config
    const today = new Date();
    const { type: sessionType, questions } = getQuestionsForDate(today);

    // Check if we already have an entry for today
    const [todayEntry, setTodayEntry] = useState(getEntry());

    useEffect(() => {
        setTodayEntry(getEntry());
    }, [isSessionActive]); // Refresh when session closes

    const handleSessionComplete = (answers: QA[]) => {
        // Create a summary content from the first answer or a generic string
        const summary = answers[0]?.answer || "Journal Entry";

        saveEntry(
            summary,
            new Date().toLocaleDateString('en-CA'),
            sessionType,
            answers
        );
        setIsSessionActive(false);
    };

    const toggleEntry = (id: string) => {
        setExpandedEntryId(prev => prev === id ? null : id);
    };

    const containerStyle = isDark
        ? {
            background: 'rgba(30, 30, 35, 0.70)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
        }
        : {
            background: 'rgba(255, 255, 255, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
        };

    const textColor = isDark ? 'text-white' : 'text-slate-800';
    const subTextColor = isDark ? 'text-white/50' : 'text-slate-500';
    const cardBg = isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/50 hover:bg-white/80';
    const accentColor = isDark ? 'text-indigo-400' : 'text-indigo-600';

    if (isSessionActive) {
        return (
            <JournalSession
                isDark={isDark}
                questions={questions}
                onComplete={handleSessionComplete}
                onCancel={() => setIsSessionActive(false)}
                // If editing existing entry, could pass initialAnswers here
                initialAnswers={todayEntry?.questions}
            />
        );
    }

    // Sort entries by date desc (if entries array exists/exposed) or just minimal for now
    // NOTE: The current hook doesn't expose `entries` array directly in the view file provided in context, 
    // but the file content for `useJournal.ts` showed it returning `entries`. 
    // We will assume it's available. If not, we fix.

    const sortedEntries = [...entries].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div
            className="w-full h-[80vh] flex flex-col rounded-[2rem] p-8 transition-all duration-500 animate-fade-in-up overflow-hidden"
            style={{
                ...containerStyle,
                backdropFilter: 'blur(30px) saturate(150%)',
                WebkitBackdropFilter: 'blur(30px) saturate(150%)',
                boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 20px 40px -10px rgba(0, 0, 0, 0.1)'
            }}
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className={`text-3xl font-light tracking-tight ${textColor}`}>Journal</h2>
                    <p className={`text-sm mt-1 font-light ${subTextColor}`}>Reflect. Plan. Grow.</p>
                </div>
                <button
                    onClick={() => setIsSessionActive(true)}
                    className={`
                        px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium transition-all shadow-lg hover:scale-105 active:scale-95
                        ${isDark ? 'bg-indigo-600 text-white shadow-indigo-900/40' : 'bg-slate-900 text-white shadow-slate-300'}
                    `}
                >
                    <Plus size={16} />
                    {todayEntry ? 'Edit Today\'s Entry' : 'Start Today'}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">

                {sortedEntries.length === 0 && (
                    <div className={`h-full flex flex-col items-center justify-center opacity-40 ${textColor}`}>
                        <BookOpen size={48} strokeWidth={1} className={subTextColor} />
                        <p className="mt-4 text-lg font-light">Your journey begins today.</p>
                    </div>
                )}

                {sortedEntries.map((entry) => (
                    <div
                        key={entry.id}
                        className={`rounded-2xl transition-all duration-300 border border-transparent ${cardBg} ${expandedEntryId === entry.id ? 'bg-opacity-100 shadow-lg' : ''}`}
                    >
                        <div
                            onClick={() => toggleEntry(entry.id)}
                            className="p-5 cursor-pointer flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'} ${accentColor}`}>
                                    <Calendar size={20} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className={`font-medium ${textColor}`}>
                                        {new Date(entry.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </h3>
                                    <div className={`flex items-center gap-2 text-xs uppercase tracking-wider font-medium opacity-60 ${textColor}`}>
                                        <span className={`px-2 py-0.5 rounded-md ${isDark ? 'bg-white/10' : 'bg-slate-200'} `}>
                                            {entry.type || 'Freeform'}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={10} />
                                            {new Date(entry.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={`transition-transform duration-300 ${textColor} opacity-50 group-hover:opacity-100 ${expandedEntryId === entry.id ? 'rotate-180' : ''}`}>
                                <ChevronDown size={20} />
                            </div>
                        </div>

                        {/* Expanded Content */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedEntryId === entry.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className={`px-6 pb-6 pt-0 border-t ${isDark ? 'border-white/5' : 'border-slate-200/50'}`}>
                                <div className="mt-4 space-y-6">
                                    {entry.questions && entry.questions.length > 0 ? (
                                        entry.questions.map((q, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <p className={`text-sm font-medium opacity-70 ${accentColor}`}>
                                                    {q.question.split('\n')[0]}
                                                </p>
                                                <p className={`text-base font-light leading-relaxed whitespace-pre-wrap ${textColor}`}>
                                                    {q.answer || <span className="italic opacity-40">No answer provided.</span>}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className={`text-base font-light leading-relaxed whitespace-pre-wrap ${textColor}`}>
                                            {entry.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
