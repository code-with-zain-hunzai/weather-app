"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function WeatherApp() {
  const [city, setCity] = useState<string>('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<LocationHistory[]>([]);
  const [activeTab, setActiveTab] = useState<string>('current');

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
        (error) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full bg-gray-800 text-white shadow-xl rounded-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">🌤️ Weather Forecast App</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Get current weather & upcoming 5-day forecast
            </CardDescription>
          </CardHeader>

          <CardContent>
            <WeatherSearch 
              city={city} 
              setCity={setCity} 
              getWeather={getWeather} 
              getLocationWeather={getLocationWeather} 
            />

            {loading && <LoadingSpinner />}

            {error && (
              <Alert variant="destructive" className="my-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {currentWeather && (
              <>
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2">Current Weather</h2>
                  <CurrentWeather weatherData={currentWeather} />
                </div>

                {forecast && (
                  <>
                    <UpcomingHoursWeather forecastData={forecast} />
                    
                    <div className="mt-8">
                      <h2 className="text-xl font-semibold mb-2">5-Day Forecast</h2>
                      <WeatherForecast forecastData={forecast} />
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <SearchHistory 
          historyData={searchHistory} 
          onSelectCity={searchHistoryCity} 
        />
      </div>
    </div>
  );
}