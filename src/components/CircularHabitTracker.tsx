

import { useTaskManager } from '../hooks/useTaskManager';

interface CircularHabitTrackerProps {
    isDark: boolean;
}

export const CircularHabitTracker = ({ isDark }: CircularHabitTrackerProps) => {
    const { tasks } = useTaskManager();

    // Configuration - Dynamic days in month
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const activeHabits = tasks.slice(0, 8); // Max 8 habits to fit the circular design comfortably
    const centerSize = 80;
    const ringThickness = 28;
    const gap = 2; // gap between rings
    // The design shows a gap, let's use 300 degrees
    const maxAngle = 300;

    // Geometry
    // Center is at 0,0 for SVG

    // Helper to polar to cartesian
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };



    // Calculate segment paths
    const getSegmentPath = (dayIndex: number, innerR: number, outerR: number) => {
        const stepAngle = maxAngle / daysInMonth; // Angle per day
        const sa = dayIndex * stepAngle;
        const ea = (dayIndex + 1) * stepAngle - 1; // 1 degree gap between segments

        // Inner arc
        const startInner = polarToCartesian(0, 0, innerR, ea);
        const endInner = polarToCartesian(0, 0, innerR, sa);

        // Outer arc
        const startOuter = polarToCartesian(0, 0, outerR, ea);
        const endOuter = polarToCartesian(0, 0, outerR, sa);

        // Close the shape
        return `
            M ${startInner.x} ${startInner.y}
            L ${startOuter.x} ${startOuter.y}
            A ${outerR} ${outerR} 0 0 0 ${endOuter.x} ${endOuter.y}
            L ${endInner.x} ${endInner.y}
            A ${innerR} ${innerR} 0 0 1 ${startInner.x} ${startInner.y}
            Z
        `;
    };

    // Current Date Context (using 'today' from line 13)
    const currentDay = today.getDate(); // 1-31
    const currentMonthPrefix = today.toLocaleDateString('en-CA').slice(0, 7); // YYYY-MM
    const todayString = today.toLocaleDateString('en-CA');

    const subTextColor = isDark ? 'fill-white/50' : 'fill-slate-500';

    // Aesthetic colors for rings (inner to outer)
    const ringColors = [
        '#10b981', // emerald-500
        '#3b82f6', // blue-500
        '#8b5cf6', // violet-500
        '#f59e0b', // amber-500
        '#ec4899', // pink-500
        '#06b6d4', // cyan-500
        '#84cc16', // lime-500
        '#f43f5e', // rose-500
    ];

    const radiusBase = centerSize;
    const size = (radiusBase + (activeHabits.length * (ringThickness + gap))) * 2 + 100; // viewBox size
    const viewBoxSize = size;
    const center = viewBoxSize / 2;

    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="w-full h-full flex items-center justify-center relative">
                <svg width="100%" height="100%" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="max-h-full">
                    <g transform={`translate(${center}, ${center}) rotate(180)`}> {/* Rotate to start from bottom or logic */}
                        {/* We want day 1 to start at top? Let's assume standard clockwise from top if we didn't rotate. 
                             Currently logic is 0=top (-90 deg in calc). 
                             Let's just group and rotate logic if needed. 
                             Actually, let's keep it simple. */}

                        {/* Rings */}
                        {activeHabits.map((habit, hIndex) => {
                            const innerR = radiusBase + hIndex * (ringThickness + gap);
                            const outerR = innerR + ringThickness;
                            const color = ringColors[hIndex % ringColors.length];

                            return (
                                <g key={habit.id}>
                                    {Array.from({ length: daysInMonth }).map((_, dIndex) => {
                                        const dayNum = dIndex + 1;
                                        // Check completion
                                        // Construct date string for this day in current month??
                                        // For simplicity, let's just match day number against history dates?
                                        // Or better, assume history has full dates.
                                        // We need to check if YYYY-MM-DD matches.

                                        // Problem: If history spans months, day '1' appears multiple times.
                                        // Constraint: Let's assume this view is for CURRENT MONTH.

                                        const checkDate = `${currentMonthPrefix}-${dayNum.toString().padStart(2, '0')}`;
                                        const isComplete =
                                            checkDate === todayString
                                                ? habit.isCompleted
                                                : habit.completionHistory?.includes(checkDate);

                                        return (
                                            <path
                                                key={dIndex}
                                                d={getSegmentPath(dIndex, innerR, outerR)}
                                                className={`transition-all duration-300 hover:opacity-80 cursor-pointer`}
                                                fill={isComplete ? color : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')}
                                                stroke={isDark ? '#1e1e24' : '#ffffff'}
                                                strokeWidth={1}
                                                opacity={dayNum > currentDay ? 0.3 : 1} // Future days dimmed
                                            >
                                                <title>{`Day ${dayNum}: ${habit.text}`}</title>
                                            </path>
                                        );
                                    })}
                                </g>
                            );
                        })}
                    </g>

                    {/* Labels (Days) - Outer Numbers */}
                    <g transform={`translate(${center}, ${center}) rotate(180)`}>
                        {Array.from({ length: daysInMonth }).map((_, dIndex) => {
                            const outerMostR = radiusBase + activeHabits.length * (ringThickness + gap) + 20;
                            const stepAngle = maxAngle / daysInMonth;
                            const angle = dIndex * stepAngle + stepAngle / 2; // Center of segment
                            const pos = polarToCartesian(0, 0, outerMostR, angle);

                            return (
                                <text
                                    key={dIndex}
                                    x={pos.x}
                                    y={pos.y}
                                    dy="0.35em"
                                    textAnchor="middle"
                                    className={`text-[10px] font-medium ${subTextColor}`}
                                    transform={`rotate(${angle - 90 + 180}, ${pos.x}, ${pos.y})`} /* Rotate text to align with ray */
                                    style={{ fontSize: '10px' }}
                                >
                                    {dIndex + 1}
                                </text>
                            );
                        })}
                    </g>
                </svg>

                {/* Legend / List on the side or overlay? 
                    The design shows lines connecting to the start. 
                    Let's put a simple list in the center or side.
                */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    {/* Inner decorative element like the asterisk in design */}
                    <div className={`text-6xl ${isDark ? 'text-white/10' : 'text-slate-400/20'}`}>❋</div>
                </div>
            </div>

            {/* Legend Below */}
            <div className="w-full flex flex-wrap justify-center gap-4 mt-4 px-4">
                {activeHabits.map((habit, i) => (
                    <div key={habit.id} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: ringColors[i % ringColors.length] }}
                        />
                        <span className={`text-xs ${isDark ? 'text-white/70' : 'text-slate-600'}`}>{habit.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
