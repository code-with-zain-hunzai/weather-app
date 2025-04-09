import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Wind, Droplets, Sun } from "lucide-react";
import WeatherIcon from './WeatherIcon';

export default function CurrentWeather({ weatherData }) {
  if (!weatherData) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">
              {weatherData.name}, {weatherData.sys.country}
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </div>
          <div className="flex items-center">
            <WeatherIcon iconCode={weatherData.weather[0].icon} size={10} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <div className="text-4xl font-bold">
              {Math.round(weatherData.main.temp)}°C
            </div>
            <div className="text-lg capitalize">
              {weatherData.weather[0].description}
            </div>
            <div className="text-sm text-gray-500">
              Feels like: {Math.round(weatherData.main.feels_like)}°C
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer size={18} className="text-orange-500" />
              <div>
                <div className="text-sm text-gray-500">High / Low</div>
                <div>{Math.round(weatherData.main.temp_max)}° / {Math.round(weatherData.main.temp_min)}°</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Wind size={18} className="text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Wind</div>
                <div>{weatherData.wind.speed} m/s</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Droplets size={18} className="text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Humidity</div>
                <div>{weatherData.main.humidity}%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Sun size={18} className="text-yellow-500" />
              <div>
                <div className="text-sm text-gray-500">Visibility</div>
                <div>{(weatherData.visibility / 1000).toFixed(1)} km</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}