const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export const fetchWeatherByCity = async (city) => {
  const currentResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  
  if (!currentResponse.ok) {
    throw new Error(`City not found or API error: ${currentResponse.status}`);
  }
  
  return await currentResponse.json();
};

export const fetchForecastByCity = async (city) => {
  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  
  if (!forecastResponse.ok) {
    throw new Error(`Forecast data not available: ${forecastResponse.status}`);
  }
  
  return await forecastResponse.json();
};

export const fetchWeatherByCoords = async (latitude, longitude) => {
  const currentResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
  );
  
  if (!currentResponse.ok) {
    throw new Error(`API error: ${currentResponse.status}`);
  }
  
  return await currentResponse.json();
};

export const fetchForecastByCoords = async (latitude, longitude) => {
  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
  );
  
  if (!forecastResponse.ok) {
    throw new Error(`Forecast data not available: ${forecastResponse.status}`);
  }
  
  return await forecastResponse.json();
};