import { Book, CheckSquare, X } from 'lucide-react';

interface NavigationProps {
    currentView: 'goals' | 'journal' | 'habits';
    onViewChange: (view: 'goals' | 'journal' | 'habits') => void;
    isDark: boolean;
}

export const Navigation = ({ currentView, onViewChange, isDark }: NavigationProps) => {
    // Only show Journal and Habit buttons if we are on 'goals' (home)
    // If we are on 'journal' or 'habits', we'll show a close button inside the view itself or here?
    // User requested "buttons in the top right corner". 
    // Let's make them persistent but act as toggles.

    // If view is not goals, we are in "page mode". The page itself might have a back button, 
    // or clicking the active button again closes it.

    const buttons = [
        { id: 'journal' as const, label: 'Journal', icon: Book },
        { id: 'habits' as const, label: 'Habits', icon: CheckSquare },
    ];

    const textColor = isDark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-900';


    if (currentView !== 'goals') {
        // When in a full page view, maybe show a simple "Close" or "Home" button in top right?
        // Or keep the nav? "New separate aesthetic looking pages" implies full immersion.
        // Let's provide a prominent "Close" button here if active.
        return (
            <div className="fixed top-6 right-6 z-50 flex gap-3">
                <button
                    onClick={() => onViewChange('goals')}
                    className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`}
                    title="Close"
                >
                    <X size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed top-6 right-6 z-50 flex gap-3 animate-fade-in-down">
            {buttons.map((btn) => {
                const Icon = btn.icon;
                return (
                    <button
                        key={btn.id}
                        onClick={() => onViewChange(btn.id)}
                        className={`
                            group relative p-3 rounded-full backdrop-blur-md transition-all duration-300
                            ${textColor}
                            ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}
                        `}
                        title={btn.label}
                    >
                        <Icon size={20} strokeWidth={1.5} />
                        <span className={`
                            absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none whitespace-nowrap
                            ${isDark ? 'bg-white/10 text-white' : 'bg-white text-slate-800 shadow-sm'}
                        `}>
                            {btn.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
