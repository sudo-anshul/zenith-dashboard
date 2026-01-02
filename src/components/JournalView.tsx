
import { useEffect, useState } from 'react'; // Added imports
import { useJournal } from '../hooks/useJournal';

interface JournalViewProps {
    isDark: boolean;
}

export const JournalView = ({ isDark }: JournalViewProps) => {
    const { getEntry, saveEntry } = useJournal();
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setContent(getEntry());
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setContent(newValue);
        setIsSaving(true);

        // Debounce save (simple implementation)
        const timeoutId = setTimeout(() => {
            saveEntry(newValue);
            setIsSaving(false);
        }, 1000);

        return () => clearTimeout(timeoutId);
    };

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
    const placeholderColor = isDark ? 'placeholder:text-white/20' : 'placeholder:text-slate-400';

    return (
        <div
            className="w-full h-[80vh] flex flex-col rounded-[2rem] p-8 transition-all duration-500 animate-fade-in-up"
            style={{
                ...containerStyle,
                backdropFilter: 'blur(30px) saturate(150%)',
                WebkitBackdropFilter: 'blur(30px) saturate(150%)',
            }}
        >
            <div className="flex justify-between items-baseline mb-6">
                <div>
                    <h2 className={`text-2xl font-medium tracking-tight ${textColor}`}>Daily Journal</h2>
                    <p className={`text-sm mt-1 font-light ${subTextColor}`}>Clear your mind.</p>
                </div>
                <div className={`text-xs font-mono transition-opacity ${isSaving ? 'opacity-100' : 'opacity-0'} ${subTextColor}`}>
                    Saving...
                </div>
            </div>

            <textarea
                value={content}
                onChange={handleChange}
                placeholder="Write your thoughts here..."
                className={`
                    w-full flex-1 bg-transparent resize-none outline-none 
                    text-base leading-relaxed font-light ${textColor} ${placeholderColor}
                    custom-scrollbar
                `}
                spellCheck={false}
            />
        </div>
    );
};
