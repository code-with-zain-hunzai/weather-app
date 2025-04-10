"use client"

import { useState } from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Thermometer, Wind, Droplets, Cloud, Clock } from "lucide-react";
import WeatherIcon from './WeatherIcon';

// This component shows weather forecast for upcoming hours
export default function UpcomingHoursWeather({ forecastData }) {
  const [startIndex, setStartIndex] = useState(0);
  
  if (!forecastData || !forecastData.list || forecastData.list.length === 0) {
    return null;
  }
  
  const hourlyForecast = forecastData.list.slice(0, 8);
  
  const displayCount = 4;

  const handlePrevious = () => {
    setStartIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setStartIndex(prev => Math.min(hourlyForecast.length - displayCount, prev + 1));
  };
  
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getPrecipitationProbability = (pop) => {
    return Math.round(pop * 100);
  };

  return (
    <Card className="w-full mt-6 bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-xl font-semibold">Upcoming Hours</CardTitle>
          <div className="flex space-x-2">
            <button 
              onClick={handlePrevious} 
              disabled={startIndex === 0}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition-colors"
              aria-label="Previous hours"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext} 
              disabled={startIndex >= hourlyForecast.length - displayCount}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition-colors"
              aria-label="Next hours"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {hourlyForecast.slice(startIndex, startIndex + displayCount).map((item, index) => (
            <div key={item.dt} className="bg-gray-700 rounded-lg p-3 text-center hover:bg-gray-600 transition-colors">
              <div className="flex justify-center items-center gap-1 mb-1">
                <Clock size={14} className="text-gray-400" />
                <div className="font-medium text-sm">{formatTime(item.dt)}</div>
              </div>
              <div className="text-xs text-gray-400 mb-2">{formatDate(item.dt)}</div>
              
              <div className="flex justify-center mb-2">
                <WeatherIcon iconCode={item.weather[0].icon} size={8} />
              </div>
              
              <div className="text-2xl font-bold mb-2">
                {Math.round(item.main.temp)}°C
              </div>
              
              <div className="text-xs capitalize text-gray-300 mb-3 h-8">
                {item.weather[0].description}
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex flex-col items-center">
                  <Thermometer size={14} className="text-orange-500 mb-1" />
                  <span title="Feels like">{Math.round(item.main.feels_like)}°</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <Wind size={14} className="text-blue-500 mb-1" />
                  <span title="Wind speed">{item.wind.speed} m/s</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <Droplets size={14} className="text-blue-500 mb-1" />
                  <span title="Humidity">{item.main.humidity}%</span>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-600 flex justify-center items-center gap-1">
                <Cloud size={14} className="text-gray-400" />
                <span className="text-xs" title="Precipitation probability">
                  {getPrecipitationProbability(item.pop)}% chance
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}