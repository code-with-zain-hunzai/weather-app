"use client"
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

import WeatherSearch from './components/WeatherSearch';
import CurrentWeather from './components/CurrentWeather';
import WeatherForecast from './components/WeatherForecast';
import UpcomingHoursWeather from './components/UpcomingHoursWeather'; 
import SearchHistory from './components/SearchHistory';
import LoadingSpinner from './components/LoadingSpinner';

import { 
  fetchWeatherByCity, 
  fetchForecastByCity, 
  fetchWeatherByCoords, 
  fetchForecastByCoords 
} from '@/utils/weatherService';

interface WeatherCoord {
  lon: number;
  lat: number;
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

interface WeatherWind {
  speed: number;
  deg: number;
  gust?: number;
}

interface WeatherSys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

interface WeatherData {
  coord: WeatherCoord;
  weather: WeatherCondition[];
  base: string;
  main: WeatherMain;
  visibility: number;
  wind: WeatherWind;
  clouds: { all: number };
  dt: number;
  sys: WeatherSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface ForecastItem {
  dt: number;
  main: WeatherMain;
  weather: WeatherCondition[];
  clouds: { all: number };
  wind: WeatherWind;
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: WeatherCoord;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

interface LocationHistory {
  name: string;
  country: string;
  coords: WeatherCoord;
  timestamp: string;
}

// ── Framer Motion Variants ─────────────────────────────────────────────────────
const pageVariants = {
  hidden:   { opacity: 0 },
  visible:  { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.2, duration: 0.8 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover:   { scale: 1.02, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' },
  tap:     { scale: 0.98 },
};

const fadeInUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const iconVariants = {
  hidden:  { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 12 } },
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function WeatherApp() {
  const [city, setCity] = useState<string>('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<LocationHistory[]>([]);
  // const [activeTab, setActiveTab] = useState<string>('current');

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = (): void => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('weatherSearchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    }
  };

  const addToSearchHistory = (data: WeatherData): void => {
    const location: LocationHistory = {
      name: data.name,
      country: data.sys.country,
      coords: data.coord,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...searchHistory];
    const existingIndex = updatedHistory.findIndex(
      item => item.name === location.name && item.country === location.country
    );

    if (existingIndex !== -1) {
      updatedHistory[existingIndex].timestamp = location.timestamp;
    } else {
      updatedHistory.push(location);
    }

    setSearchHistory(updatedHistory);
    localStorage.setItem('weatherSearchHistory', JSON.stringify(updatedHistory));
  };

  const getWeather = async (): Promise<void> => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentData = await fetchWeatherByCity(city);
      setCurrentWeather(currentData);
      addToSearchHistory(currentData);

      const forecastData = await fetchForecastByCity(city);
      setForecast(forecastData);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = (): void => {
    if (navigator.geolocation) {
      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const currentData = await fetchWeatherByCoords(latitude, longitude);
            setCurrentWeather(currentData);
            setCity(currentData.name);
            addToSearchHistory(currentData);

            const forecastData = await fetchForecastByCoords(latitude, longitude);
            setForecast(forecastData);

          } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
          } finally {
            setLoading(false);
          }
        },
        () => {
          setLoading(false);
          setError("Unable to retrieve your location. Please ensure location services are enabled.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const searchHistoryCity = (cityName: string): void => {
    setCity(cityName);
    getWeather();
  };

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-black text-white py-12 px-6"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ── Search & Current Weather Card ─────────────────────────────── */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
        >
          
          <Card className="bg-gradient-to-br from-gray-800 to-gray-700 bg-opacity-40 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-600">
            <CardHeader className="p-6">
              {currentWeather && (
                <motion.div 
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-center mb-4"
                >
                  <Image
                    src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
                    alt={currentWeather.weather[0].description}
                    className="w-24 h-24"
                  />
                </motion.div>
              )}

              <CardTitle className="text-4xl font-extrabold text-center tracking-wide">
                🌤️ Weather Forecast App
              </CardTitle>
              <CardDescription className="text-center text-gray-300 mt-2">
                Current weather & 5-day forecast
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <WeatherSearch
                city={city}
                setCity={setCity}
                getWeather={getWeather}
                getLocationWeather={getLocationWeather}
              />

              {loading && (
                <motion.div variants={fadeInUp} className="flex justify-center">
                  <LoadingSpinner />
                </motion.div>
              )}

              {error && (
                <motion.div variants={fadeInUp}>
                  <Alert variant="destructive" className="my-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {currentWeather && (
                <motion.section variants={fadeInUp} className="p-4 bg-gray-800 bg-opacity-50 rounded-xl shadow-inner">
                  <h2 className="text-2xl font-semibold mb-2">Current Weather</h2>
                  <CurrentWeather weatherData={currentWeather} />
                </motion.section>
              )}

              {forecast && currentWeather && (
                <>
                  <motion.section variants={fadeInUp} className="mt-8">
                    <UpcomingHoursWeather forecastData={forecast} />
                  </motion.section>

                  <motion.section variants={fadeInUp} className="mt-8 p-4 bg-gray-800 bg-opacity-50 rounded-xl shadow-inner">
                    <h2 className="text-2xl font-semibold mb-2">5-Day Forecast</h2>
                    <WeatherForecast forecastData={forecast} />
                  </motion.section>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Search History ──────────────────────────────────────────────── */}
        <motion.div variants={fadeInUp} className="p-6 bg-gray-800 bg-opacity-30 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-700">
          <SearchHistory
            historyData={searchHistory}
            onSelectCity={searchHistoryCity}
          />
        </motion.div>
      </div>
    </motion.main>
  );
}