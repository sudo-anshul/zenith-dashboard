import { useState } from 'react';
import { Check, CircleDashed, LayoutGrid } from 'lucide-react'; // Added icons
import { useTaskManager } from '../hooks/useTaskManager';
import { CircularHabitTracker } from './CircularHabitTracker';

interface HabitTrackerProps {
    isDark: boolean;
}

export const HabitTracker = ({ isDark }: HabitTrackerProps) => {
    const { tasks } = useTaskManager();
    const [mode, setMode] = useState<'grid' | 'circular'>('grid');

    // Get last 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
            full: d.toLocaleDateString('en-CA'),
            day: d.toLocaleDateString('en-US', { weekday: 'narrow' }), // M, T, W
            date: d.getDate()
        };
    });

    const activeHabits = tasks; // All tasks are potential habits

    const containerStyle = isDark
        ? {
            background: 'rgba(30, 30, 35, 0.70)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }
        : {
            background: 'rgba(255, 255, 255, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
        };

    const textColor = isDark ? 'text-white' : 'text-slate-800';
    const subTextColor = isDark ? 'text-white/50' : 'text-slate-500';
    const borderColor = isDark ? 'border-white/10' : 'border-slate-200';
    const scrollbarClass = isDark ? 'custom-scrollbar' : 'custom-scrollbar-light';

    return (
        <div
            className="w-full h-[80vh] flex flex-col rounded-[2rem] p-6 transition-all duration-500 animate-fade-in-up"
            style={{
                ...containerStyle,
                backdropFilter: 'blur(30px) saturate(150%)',
                WebkitBackdropFilter: 'blur(30px) saturate(150%)',
            }}
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-medium tracking-tight ${textColor}`}>Habit Tracker</h2>
                    <p className={`text-sm mt-1 font-light ${subTextColor}`}>"Our habits shape who we are."</p>
                </div>

                {/* View Toggle */}
                <div className={`flex p-1 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}>
                    <button
                        onClick={() => setMode('grid')}
                        className={`p-2 rounded-lg transition-all ${mode === 'grid' ? (isDark ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm') : (isDark ? 'text-white/40 hover:text-white' : 'text-slate-500 hover:text-slate-800')}`}
                        title="Grid View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setMode('circular')}
                        className={`p-2 rounded-lg transition-all ${mode === 'circular' ? (isDark ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm') : (isDark ? 'text-white/40 hover:text-white' : 'text-slate-500 hover:text-slate-800')}`}
                        title="Advanced Track (Circular)"
                    >
                        <CircleDashed size={18} />
                    </button>
                </div>
            </div>

            <div className={`flex-1 overflow-hidden relative ${scrollbarClass}`}>
                {mode === 'grid' ? (
                    <div className="h-full overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className={`pb-4 pl-2 font-medium text-xs uppercase tracking-wider ${subTextColor} w-1/3`}>Habit</th>
                                    {dates.map(date => (
                                        <th key={date.full} className={`pb-4 text-center font-medium text-xs ${subTextColor}`}>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="opacity-70">{date.day}</span>
                                                <span className={`${date.full === new Date().toLocaleDateString('en-CA') ? (isDark ? 'bg-white text-black' : 'bg-slate-800 text-white') : ''} w-6 h-6 rounded-full flex items-center justify-center`}>
                                                    {date.date}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {activeHabits.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className={`py-12 text-center text-sm font-light ${subTextColor}`}>
                                            No habits tracked yet. Add tasks in Goals.
                                        </td>
                                    </tr>
                                ) : (
                                    activeHabits.map((habit) => (
                                        <tr key={habit.id} className={`border-b ${borderColor} last:border-0 group`}>
                                            <td className={`py-3 pl-2 text-sm font-light truncate max-w-[120px] ${textColor}`} title={habit.text}>
                                                {habit.text}
                                            </td>
                                            {dates.map(date => {
                                                const isCompletedToday = date.full === new Date().toLocaleDateString('en-CA') ? habit.isCompleted : habit.completionHistory?.includes(date.full);
                                                return (
                                                    <td key={date.full} className="py-3 text-center">
                                                        <div className={`
                                                            w-6 h-6 mx-auto rounded-md flex items-center justify-center transition-colors
                                                            ${isCompletedToday
                                                                ? 'bg-emerald-500/20 text-emerald-500'
                                                                : (isDark ? 'bg-white/5 text-transparent' : 'bg-slate-100 text-transparent')
                                                            }
                                                        `}>
                                                            {isCompletedToday && <Check size={14} strokeWidth={3} />}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <CircularHabitTracker isDark={isDark} />
                )}
            </div>
        </div>
    );
};
