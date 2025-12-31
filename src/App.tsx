import { useEffect, useState } from 'react';
import { Clock } from './components/Clock';
import { TaskPanel } from './components/TaskPanel';
import { SpeedDial } from './components/SpeedDial';
import { useWeather } from './hooks/useWeather';
import { generateTheme, type ThemeColors } from './utils/themeGenerator';
import { CloudRain, CloudSnow, Cloud, Sun, Moon, CloudLightning, Maximize2, Minimize2 } from 'lucide-react';

// Available texture classes
const TEXTURES = [
  'texture-noise', // Classic high-freq noise
  'texture-grain', // Softer film grain
  'texture-dots',  // Subtle geometric dots
  'texture-lines', // Diagonal minimal lines
  'texture-canvas' // Micro-grid canvas look
];

function App() {
  const { weather } = useWeather();
  const [theme, setTheme] = useState<ThemeColors | null>(null);
  const [now, setNow] = useState(new Date());
  const [activeTexture, setActiveTexture] = useState(TEXTURES[0]);
  const [isZen, setIsZen] = useState(false); // Zen Mode State

  // Set random texture on mount
  useEffect(() => {
    const random = Math.floor(Math.random() * TEXTURES.length);
    setActiveTexture(TEXTURES[random]);
  }, []);

  // Update time and theme
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000 * 60);

    const newTheme = generateTheme(now, weather?.type);
    setTheme(newTheme);

    return () => clearInterval(timer);
  }, [weather, now]);

  // Initial theme set
  useEffect(() => {
    setTheme(generateTheme(new Date(), weather?.type));
  }, [weather]);


  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (!theme) return null;

  const textPrimary = theme.isDark ? 'text-white' : 'text-slate-800';
  const textSecondary = theme.isDark ? 'text-white/80' : 'text-slate-600';
  const badgeBg = theme.isDark ? 'bg-white/10 border-white/20 text-white/70' : 'bg-slate-900/10 border-slate-900/10 text-slate-700';
  const weatherBadgeBg = theme.isDark ? 'bg-white/10 text-white/80' : 'bg-white/50 text-slate-800 shadow-sm';
  const zenIconColor = theme.isDark ? 'text-white/30 hover:text-white' : 'text-slate-400 hover:text-slate-800';

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center overflow-hidden relative transition-colors duration-1000 ${textPrimary}`}
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
        backgroundColor: theme.bgBase
      }}
    >
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 transition-opacity duration-1000">
        <div
          className="absolute w-[120vw] h-[120vw] rounded-full opacity-60 transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${theme.orb1} 0%, transparent 60%)`,
            top: '-50%',
            left: '20%',
            filter: 'blur(100px)',
            animation: 'pulse-glow 10s ease-in-out infinite alternate',
            transform: `scale(${theme.intensity})`
          }}
        />
        <div
          className="absolute w-[100vw] h-[100vw] rounded-full opacity-40 transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${theme.orb2} 0%, transparent 60%)`,
            bottom: '-40%',
            right: '-10%',
            filter: 'blur(80px)',
            animation: 'float 20s ease-in-out infinite',
            transform: `scale(${theme.intensity})`
          }}
        />
        <div
          className="absolute w-[80vw] h-[80vw] rounded-full opacity-30 transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${theme.orb3} 0%, transparent 60%)`,
            top: '40%',
            left: '-20%',
            filter: 'blur(90px)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />

        {theme.overlay === 'rain' && (
          <div className="absolute inset-0 opacity-20 bg-[url('https://ssl.gstatic.com/weather/animations/rain.gif')] bg-cover mix-blend-screen" />
        )}
        {theme.overlay === 'snow' && (
          <div className="absolute inset-0 opacity-20 bg-[url('https://ssl.gstatic.com/weather/animations/snow.gif')] bg-cover mix-blend-screen" />
        )}

        {/* RANDOM HIGH-RES TEXTURE */}
        <div className={`absolute inset-0 opacity-[0.15] ${activeTexture} mix-blend-overlay`} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 h-screen max-h-[900px]">

        {/* LEFT COLUMN */}
        <div className={`flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-8 transition-all duration-700 ${isZen ? 'translate-x-[50%] md:translate-x-[15%] scale-110' : ''}`}>

          {/* Header - Hidden in Zen Mode */}
          <div className={`space-y-3 transition-all duration-500 ${isZen ? 'opacity-0 pointer-events-none -translate-y-4' : 'opacity-100 translate-y-0 animate-fade-in-down'}`}>
            <h1 className={`text-xl md:text-2xl font-light tracking-wide flex items-center gap-3 ${textSecondary}`}>
              {greeting}, <span className={`font-medium ${textPrimary}`}>Anshul</span>
              {weather && (
                <div className={`ml-2 px-3 py-1 backdrop-blur-md rounded-full flex items-center gap-2 text-sm border border-transparent ${weatherBadgeBg}`}>
                  {weather.type === 'Rainy' && <CloudRain size={14} />}
                  {weather.type === 'Snowy' && <CloudSnow size={14} />}
                  {weather.type === 'Cloudy' && <Cloud size={14} />}
                  {weather.type === 'Clear' && (weather.isDay ? <Sun size={14} /> : <Moon size={14} />)}
                  {weather.type === 'Stormy' && <CloudLightning size={14} />}
                  <span>{Math.round(weather.temperature)}°C</span>
                </div>
              )}
            </h1>

            <div className={`inline-flex items-center px-3 py-1 rounded-full border border-opacity-20 backdrop-blur-md ${badgeBg}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              <span className="text-xs font-medium tracking-[0.2em] uppercase opacity-70">Day {dayOfYear}</span>
            </div>
          </div>

          <Clock isDark={theme.isDark} isZen={isZen} />

          {/* Speed Dial - Hidden in Zen Mode */}
          <div className={`transition-all duration-500 delay-100 ${isZen ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <SpeedDial isDark={theme.isDark} />
          </div>

        </div>

        {/* RIGHT COLUMN - Hidden in Zen Mode */}
        <div className={`flex-shrink-0 w-full max-w-[400px] transition-all duration-500 ${isZen ? 'opacity-0 pointer-events-none translate-x-20' : 'opacity-100 translate-x-0'}`}>
          <TaskPanel isDark={theme.isDark} />
        </div>

      </div>

      {/* Zen Toggle Button */}
      <button
        onClick={() => setIsZen(!isZen)}
        className={`fixed bottom-6 right-6 p-3 rounded-full backdrop-blur-md border border-transparent transition-all duration-300 ${zenIconColor} ${isZen ? 'bg-white/5 opacity-50 hover:opacity-100' : 'bg-transparent'}`}
        title="Toggle Zen Mode"
      >
        {isZen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>

    </div>
  );
}

export default App;
