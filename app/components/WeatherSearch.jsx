import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

export default function WeatherSearch({ city, setCity, getWeather, getLocationWeather }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex-1">
        <Input
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full"
        />
      </div>
      <Button onClick={getWeather} className="flex items-center gap-2">
        <Search size={18} />
        <span>Search</span>
      </Button>
      <Button variant="outline" onClick={getLocationWeather} className="flex items-center gap-2">
        <MapPin size={18} />
        <span>Use My Location</span>
      </Button>
    </div>
  );
}