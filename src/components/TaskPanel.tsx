import { useState, useRef, useEffect } from 'react';
import { Plus, CheckCircle, Circle, Trash2, Pencil, Timer, List, Play, Pause, RotateCcw } from 'lucide-react';
import { useTaskManager } from '../hooks/useTaskManager';

interface TaskPanelProps {
    isDark: boolean;
}

export const TaskPanel = ({ isDark }: TaskPanelProps) => {
    const { tasks, addTask, toggleTask, editTask, deleteTask, completedCount, totalCount } = useTaskManager();
    const [inputValue, setInputValue] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [view, setView] = useState<'list' | 'timer'>('list'); // 'list' or 'timer'

    // Timer State
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false); // To track if it's break time (5 min)

    const editInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingId]);

    // Timer Interval
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Optional: Play sound or notification here
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(isBreak ? 5 * 60 : 25 * 60); // Reset to 25 or 5 based on mode
    };
    const switchMode = () => {
        const nextIsBreak = !isBreak;
        setIsBreak(nextIsBreak);
        setTimeLeft(nextIsBreak ? 5 * 60 : 25 * 60);
        setIsActive(false);
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            addTask(inputValue.trim());
            setInputValue('');
        }
    };

    const startEditing = (id: string, currentText: string) => {
        setEditingId(id);
        setEditValue(currentText);
    };

    const saveEdit = (id: string) => {
        if (editValue.trim()) {
            editTask(id, editValue.trim());
        }
        setEditingId(null);
        setEditValue('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter') {
            saveEdit(id);
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    };

    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    // Adaptive Styles
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
    const inputBg = isDark ? 'bg-white/10 hover:bg-white/15 focus:bg-white/15' : 'bg-slate-900/5 hover:bg-slate-900/10 focus:bg-slate-900/10';
    const inputPlaceholder = isDark ? 'placeholder-white/30' : 'placeholder-slate-400';
    const borderSeparator = isDark ? 'border-white/10' : 'border-slate-200';
    const iconColorUnchecked = isDark ? 'text-white/40' : 'text-slate-400';
    const iconColorHover = isDark ? 'hover:text-white/80' : 'hover:text-slate-600';
    const scrollbarClass = isDark ? 'custom-scrollbar' : 'custom-scrollbar-light';

    // Timer Component View
    const renderTimer = () => (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up">
            {/* Circle Progress Concept or just Large Text */}
            <div className={`text-7xl font-light tracking-tighter mb-8 font-mono ${textColor}`}>
                {formatTime(timeLeft)}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleTimer}
                    className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${isActive ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}
                >
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
                <button
                    onClick={resetTimer}
                    className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${isDark ? 'bg-white/10 text-white/50 hover:text-white' : 'bg-slate-200 text-slate-500 hover:text-slate-800'}`}
                >
                    <RotateCcw size={24} />
                </button>
            </div>

            {/* Mode Switcher */}
            <div className="mt-8 flex gap-2">
                <button
                    onClick={() => { if (isBreak) switchMode(); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!isBreak ? (isDark ? 'bg-white/20 text-white' : 'bg-slate-800 text-white') : (isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-800')}`}
                >
                    Focus
                </button>
                <button
                    onClick={() => { if (!isBreak) switchMode(); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isBreak ? (isDark ? 'bg-white/20 text-white' : 'bg-slate-800 text-white') : (isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-800')}`}
                >
                    Break
                </button>
            </div>
        </div>
    );


    return (
        <div
            className="w-full flex flex-col h-[460px] rounded-[2rem] p-6 transition-all duration-500 animate-fade-in-up"
            style={{
                ...containerStyle,
                backdropFilter: 'blur(30px) saturate(150%)',
                WebkitBackdropFilter: 'blur(30px) saturate(150%)',
            }}
        >
            {/* Glass Header */}
            <div className={`flex items-end justify-between mb-8 pb-4 border-b ${borderSeparator}`}>
                <div>
                    <h2 className={`text-2xl font-medium tracking-tight ${textColor}`}>{view === 'list' ? 'Focus' : 'Timer'}</h2>
                    <p className={`text-sm mt-1 font-light ${subTextColor}`}>{view === 'list' ? "What's your goal today?" : "Stay in the zone."}</p>
                </div>

                <div className="flex flex-col items-end gap-1">
                    {view === 'list' && totalCount > 0 && (
                        <span className="text-2xl font-light text-indigo-500">{Math.round(progress)}%</span>
                    )}
                    {/* Toggle View Icon */}
                    <button
                        onClick={() => setView(view === 'list' ? 'timer' : 'list')}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white/50 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-700'}`}
                        title={view === 'list' ? "Switch to Timer" : "Switch to List"}
                    >
                        {view === 'list' ? <Timer size={20} /> : <List size={20} />}
                    </button>
                </div>
            </div>

            {/* Conditional Content */}
            {view === 'timer' ? renderTimer() : (
                <>
                    <form onSubmit={handleSubmit} className="relative mb-6 group">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="New task..."
                            className={`w-full rounded-xl px-5 py-4 pr-12 border border-transparent focus:border-opacity-20 outline-none transition-all duration-300 text-base font-light ${inputBg} ${textColor} ${inputPlaceholder}`}
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 transition-colors disabled:opacity-0 ${iconColorUnchecked} ${iconColorHover}`}
                        >
                            <Plus size={20} strokeWidth={1.5} />
                        </button>
                    </form>

                    <div className={`flex-1 overflow-y-auto space-y-3 ${scrollbarClass} pr-2`}>
                        {tasks.length === 0 ? (
                            <div className={`h-full flex flex-col items-center justify-center ${subTextColor}`}>
                                <div className={`w-12 h-12 rounded-full border border-dashed flex items-center justify-center mb-3 ${isDark ? 'border-white/20' : 'border-slate-300'}`}>
                                    <Circle size={20} />
                                </div>
                                <p className="text-sm font-light">Zero distractions.</p>
                            </div>
                        ) : (
                            tasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    className={`group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${task.isCompleted ? 'opacity-50' : isDark ? 'hover:bg-white/5' : 'hover:bg-slate-900/5'
                                        }`}
                                    style={{ animation: `fadeSlideIn 0.3s ease-out ${index * 0.05}s both` }}
                                >
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className={`mt-1 flex-shrink-0 transition-colors ${iconColorUnchecked} hover:text-indigo-500`}
                                    >
                                        {task.isCompleted ? <CheckCircle size={20} className="text-indigo-500" /> : <Circle size={20} />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        {editingId === task.id ? (
                                            <input
                                                ref={editInputRef}
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                                                onBlur={() => saveEdit(task.id)}
                                                className={`w-full bg-transparent border-b outline-none pb-1 ${textColor} ${isDark ? 'border-indigo-500/50' : 'border-indigo-500'}`}
                                            />
                                        ) : (
                                            <span
                                                className={`block text-base leading-relaxed break-words ${task.isCompleted
                                                        ? `${subTextColor} line-through ${isDark ? 'decoration-white/20' : 'decoration-slate-300'}`
                                                        : `${textColor} font-light`
                                                    }`}
                                            >
                                                {task.text}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {editingId !== task.id && (
                                            <>
                                                <button onClick={() => startEditing(task.id, task.text)} className={`p-1.5 rounded ${iconColorUnchecked} ${iconColorHover} ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => deleteTask(task.id)} className={`p-1.5 rounded ${iconColorUnchecked} hover:text-red-500 ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {totalCount > 0 && (
                        <div className={`mt-4 pt-4 border-t ${borderSeparator}`}>
                            <div className={`h-0.5 w-full overflow-hidden rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
