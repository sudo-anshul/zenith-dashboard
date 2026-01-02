import { useState, useEffect } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { QA } from '../types';

interface JournalSessionProps {
    questions: string[];
    onComplete: (answers: QA[]) => void;
    onCancel: () => void;
    initialAnswers?: QA[];
    isDark: boolean;
}

export const JournalSession = ({ questions, onComplete, onCancel, initialAnswers, isDark }: JournalSessionProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<QA[]>(
        initialAnswers || questions.map(q => ({ question: q, answer: '' }))
    );
    const [currentAnswer, setCurrentAnswer] = useState(answers[0]?.answer || '');
    const [isExiting, setIsExiting] = useState(false);

    // Update current answer when index changes
    useEffect(() => {
        setCurrentAnswer(answers[currentIndex]?.answer || '');
    }, [currentIndex, answers]);

    const handleNext = () => {
        // Save current answer
        const newAnswers = [...answers];
        newAnswers[currentIndex] = { question: questions[currentIndex], answer: currentAnswer };
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            handleFinish(newAnswers);
        }
    };

    const handleFinish = (finalAnswers: QA[]) => {
        setIsExiting(true);
        setTimeout(() => {
            onComplete(finalAnswers);
        }, 500);
    };

    const progress = ((currentIndex + 1) / questions.length) * 100;

    const textColor = isDark ? 'text-white' : 'text-slate-900';
    const subTextColor = isDark ? 'text-white/60' : 'text-slate-500';
    const inputBg = isDark ? 'bg-white/5 border-white/10 focus:border-white/30' : 'bg-slate-100 border-slate-200 focus:border-slate-400';

    return (
        <div className={`
            fixed inset-0 z-50 flex flex-col items-center justify-center p-6 md:p-12
            transition-all duration-500 
            ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-fade-in-up'}
            ${isDark ? 'bg-[#0f1014]' : 'bg-[#eef2f6]'}
        `}>
            {/* Background Texture similar to main app */}
            <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${isDark ? 'bg-white' : 'bg-black'} mix-blend-overlay`}
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")' }}
            />

            {/* Content Container */}
            <div className="relative w-full max-w-3xl z-10 flex flex-col h-full max-h-[600px]">

                {/* Header / Progress */}
                <div className="flex justify-between items-center mb-12">
                    <button onClick={onCancel} className={`text-sm tracking-widest uppercase hover:underline ${subTextColor}`}>
                        Cancel
                    </button>
                    <div className="flex items-center gap-4">
                        <span className={`text-sm font-mono ${subTextColor}`}>{currentIndex + 1} / {questions.length}</span>
                        <div className="w-32 h-1 bg-gray-200/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="mb-8 animate-fade-in-left key={currentIndex}">
                        <h2 className={`text-3xl md:text-4xl font-light leading-snug mb-4 ${textColor}`}>
                            {questions[currentIndex].split('\n')[0]}
                        </h2>
                        {questions[currentIndex].split('\n')[1] && (
                            <p className={`text-lg md:text-xl font-light italic opacity-70 ${subTextColor}`}>
                                {questions[currentIndex].split('\n')[1]}
                            </p>
                        )}
                    </div>

                    <textarea
                        autoFocus
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className={`
                            w-full h-40 md:h-56 p-6 rounded-2xl md:text-xl font-light leading-relaxed resize-none outline-none transition-colors duration-300
                            ${inputBg}
                            ${textColor}
                            placeholder:opacity-30
                        `}
                    />
                </div>

                {/* Footer / Controls */}
                <div className="mt-12 flex justify-end gap-4">
                    <button
                        onClick={() => {
                            // Skip logic if needed, currently behaves same as next (empty answer)
                            handleNext();
                        }}
                        className={`px-6 py-3 rounded-xl transition-colors ${isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleNext}
                        className={`
                            px-8 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 transform hover:scale-105 active:scale-95
                            ${isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xl'}
                        `}
                    >
                        {currentIndex === questions.length - 1 ? (
                            <>Finish <Check size={18} /></>
                        ) : (
                            <>Next <ArrowRight size={18} /></>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};
