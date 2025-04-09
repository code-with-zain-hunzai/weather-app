import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WeatherIcon from './WeatherIcon';

export default function WeatherForecast({ forecastData }) {
  if (!forecastData) return null;

  // Group forecast data by date
  const groupForecastByDay = () => {
    const dailyData = {};
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: date,
          day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          weather: item.weather[0],
          icon: item.weather[0].icon
        };
      } else {
        dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
        dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
      }
    });
    
    return Object.values(dailyData).slice(0, 5);
  };

  const dailyForecast = groupForecastByDay();

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {dailyForecast.map((day, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="p-4 pb-2 text-center bg-gray-50">
            <CardTitle className="text-lg font-medium">{day.day}</CardTitle>
            <CardDescription>{day.date}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <WeatherIcon iconCode={day.icon} size={8} />
            </div>
            <div className="text-sm capitalize mb-2">{day.weather.description}</div>
            <div className="flex justify-center gap-2 text-sm">
              <span className="font-medium">{Math.round(day.temp_max)}°</span>
              <span className="text-gray-500">{Math.round(day.temp_min)}°</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}