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
        <div className={`flex flex-col items-center md:items-start select-none transition-all duration-700 ${isZen ? 'scale-125 md:scale-150 origin-center md:origin-left' : 'scale-100'}`}>
            {/* Time Display */}
            <div className="relative leading-[1.1] pb-2 overflow-visible">
                <span
                    className={`font-extralight tracking-tighter block transition-all duration-700 ${isZen ? 'text-[6rem] sm:text-[9rem] lg:text-[13rem]' : 'text-[8rem] sm:text-[10rem] lg:text-[12rem]'}`}
                    style={{
                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                        ...gradientText,
                        paddingBottom: '0.5em', // Significant padding to catch any descender
                        marginBottom: '-0.3em'  // Pull layout back up to compensate
                    }}
                >
                    {displayHours}:{displayMinutes}{isZen && `:${displaySeconds}`}
                </span>
                <span className={`absolute top-[10%] -right-12 md:-right-16 text-3xl font-light tracking-widest ${periodColor}`}>
                    {period}
                </span>
            </div>

            {/* Date Display - Cleaner Typography */}
            <div className="mt-2 md:pl-2">
                <p className={`text-2xl md:text-3xl font-light tracking-wide ${dayColor}`}>
                    {weekday}
                </p>
                <p className={`text-lg md:text-xl font-light mt-1 ${dateColor}`}>
                    {fullDate}
                </p>
            </div>
        </div>
    );
};
