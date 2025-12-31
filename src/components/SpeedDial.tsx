import { Mail, Youtube, Github, Globe, Linkedin, Twitter } from 'lucide-react';

interface SpeedDialProps {
    isDark: boolean;
}

export const SpeedDial = ({ isDark }: SpeedDialProps) => {
    const links = [
        { icon: <Mail size={20} />, url: 'https://gmail.com', label: 'Gmail', color: 'hover:text-red-400' },
        { icon: <Youtube size={20} />, url: 'https://youtube.com', label: 'YouTube', color: 'hover:text-red-500' },
        { icon: <Github size={20} />, url: 'https://github.com', label: 'GitHub', color: 'hover:text-white' },
        { icon: <Linkedin size={20} />, url: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-400' },
        { icon: <Twitter size={20} />, url: 'https://twitter.com', label: 'Twitter', color: 'hover:text-sky-400' },
        { icon: <Globe size={20} />, url: 'https://google.com', label: 'Search', color: 'hover:text-emerald-400' },
    ];

    // Adaptive Styles
    const containerStyle = isDark
        ? 'bg-white/5 border-white/10 text-white/50'
        : 'bg-slate-900/5 border-slate-900/5 text-slate-500';

    const itemHoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-slate-900/10';

    return (
        <div
            className={`flex items-center gap-2 p-2 rounded-2xl border backdrop-blur-md transition-all duration-300 ${containerStyle}`}
        >
            {links.map((link, index) => (
                <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl transition-all duration-300 group relative ${itemHoverBg} ${link.color}`}
                    aria-label={link.label}
                >
                    <div className="transform transition-transform duration-200 group-hover:scale-110">
                        {link.icon}
                    </div>

                    {/* Tooltip */}
                    <span
                        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none ${isDark ? 'text-white/80' : 'text-slate-600'}`}
                    >
                        {link.label}
                    </span>
                </a>
            ))}
        </div>
    );
};
