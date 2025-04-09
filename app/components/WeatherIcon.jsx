import { Sun, Cloud, CloudRain } from "lucide-react";

export default function WeatherIcon({ iconCode, size = 10 }) {
  const iconMap = {
    '01d': <Sun className={`h-${size} w-${size} text-yellow-500`} />,
    '01n': <Sun className={`h-${size} w-${size} text-gray-400`} />,
    '02d': <Cloud className={`h-${size} w-${size} text-gray-500`} />,
    '02n': <Cloud className={`h-${size} w-${size} text-gray-500`} />,
    '03d': <Cloud className={`h-${size} w-${size} text-gray-500`} />,
    '03n': <Cloud className={`h-${size} w-${size} text-gray-500`} />,
    '04d': <Cloud className={`h-${size} w-${size} text-gray-500`} />,
    '04n': <Cloud className={`h-${size} w-${size} text-gray-500`} />,
    '09d': <CloudRain className={`h-${size} w-${size} text-blue-500`} />,
    '09n': <CloudRain className={`h-${size} w-${size} text-blue-500`} />,
    '10d': <CloudRain className={`h-${size} w-${size} text-blue-500`} />,
    '10n': <CloudRain className={`h-${size} w-${size} text-blue-500`} />,
    '11d': <CloudRain className={`h-${size} w-${size} text-purple-500`} />,
    '11n': <CloudRain className={`h-${size} w-${size} text-purple-500`} />,
    '13d': <CloudRain className={`h-${size} w-${size} text-blue-200`} />,
    '13n': <CloudRain className={`h-${size} w-${size} text-blue-200`} />,
    '50d': <Cloud className={`h-${size} w-${size} text-gray-400`} />,
    '50n': <Cloud className={`h-${size} w-${size} text-gray-400`} />
  };
  
  return iconMap[iconCode] || <Cloud className={`h-${size} w-${size} text-gray-500`} />;
}