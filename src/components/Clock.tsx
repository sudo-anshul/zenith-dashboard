import { useCurrentTime } from '../hooks/useCurrentTime';

interface ClockProps {
    isDark: boolean;
    isZen?: boolean;
}

export const Clock = ({ isDark, isZen = false }: ClockProps) => {
    const time = useCurrentTime();

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    const displaySeconds = seconds.toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';

    const weekday = time.toLocaleDateString(undefined, { weekday: 'long' });
    const fullDate = time.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

    // Styles based on contract
    const gradientText = isDark
        ? {
            background: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.1))'
        }
        : {
            background: 'linear-gradient(180deg, #1e293b 0%, #475569 100%)', // Slate 800 to 600
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.1))'
        };

    const periodColor = isDark ? 'text-white/30' : 'text-slate-900/30';
    const dayColor = isDark ? 'text-white/80' : 'text-slate-700';
    const dateColor = isDark ? 'text-indigo-300/60' : 'text-indigo-600/60';

    return (
        <div className={`flex flex-col items-center transition-all duration-700 ease-in-out select-none ${isZen ? 'md:items-center' : 'md:items-start'}`}>
            {/* Time Display */}
            <div
                className={`relative leading-[1.1] pb-2 overflow-visible transition-transform duration-700 ease-in-out ${isZen ? 'origin-center' : 'origin-center md:origin-left'}`}
                style={{
                    transform: isZen ? 'scale(1.4)' : 'scale(1)',
                }}
            >
                <span
                    className={`font-extralight tracking-tighter block text-[8rem] sm:text-[10rem] lg:text-[12rem]`}
                    style={{
                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                        ...gradientText,
                        paddingBottom: '0.1em',
                        marginBottom: '-0.1em',
                        paddingRight: '0.1em',
                        marginRight: '-0.1em'
                    }}
                >
                    {displayHours}:{displayMinutes}
                    {isZen && (
                        <span
                            className="opacity-0 animate-[fade-in_0.5s_0.2s_forwards]"
                            style={{ ...gradientText }}
                        >
                            :{displaySeconds}
                        </span>
                    )}
                </span>

                <span className={`absolute top-[10%] -right-12 md:-right-16 text-3xl font-light tracking-widest ${periodColor}`}>
                    {period}
                </span>
            </div>

            {/* Date Display - Cleaner Typography */}
            <div className={`mt-2 transition-all duration-700 ${isZen ? 'md:pl-0 text-center scale-110 opacity-80 origin-center' : 'md:pl-2 text-left origin-left'}`}>
                <p className={`text-2xl md:text-3xl font-light tracking-wide ${dayColor}`}>
                    {weekday}
                </p>
                <p className={`text-lg md:text-xl font-light mt-1 ${dateColor}`}>
                    {fullDate}
                </p>
            </div>

            <style>{`
                @keyframes fade-in {
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};
