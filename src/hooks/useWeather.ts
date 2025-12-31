import { useState, useEffect } from 'react';

export type WeatherType = 'Clear' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Stormy' | 'Foggy';

interface WeatherData {
    type: WeatherType;
    temperature: number;
    isDay: boolean;
}

// WMO Weather interpretation codes (WMO-4500)
function getWeatherType(code: number): WeatherType {
    if (code === 0 || code === 1) return 'Clear';
    if (code === 2 || code === 3) return 'Cloudy';
    if ([45, 48].includes(code)) return 'Foggy';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'Rainy';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowy';
    if ([95, 96, 99].includes(code)) return 'Stormy';
    return 'Clear';
}

export function useWeather() {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. Check LocalStorage Cache (1 hour)
        const cached = localStorage.getItem('weather_cache');
        if (cached) {
            const { timestamp, data: cachedData } = JSON.parse(cached);
            if (Date.now() - timestamp < 3600000) { // 1 hour
                setData(cachedData);
                setLoading(false);
                return;
            }
        }

        // 2. Get Location & Fetch
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,weather_code&timezone=auto`
                    );
                    const json = await res.json();

                    if (!json.current) throw new Error('Invalid API response');

                    const newData: WeatherData = {
                        type: getWeatherType(json.current.weather_code),
                        temperature: json.current.temperature_2m,
                        isDay: !!json.current.is_day,
                    };

                    localStorage.setItem('weather_cache', JSON.stringify({
                        timestamp: Date.now(),
                        data: newData
                    }));

                    setData(newData);
                } catch (err) {
                    setError('Failed to fetch weather');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
    }, []);

    return { weather: data, loading, error };
}
