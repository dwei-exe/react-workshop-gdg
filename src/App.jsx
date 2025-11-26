import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { getFavoriteCities, addFavoriteCity, removeFavoriteCity } from './lib/weatherService';
import './App.css';

const App = () => {
  const [weatherCards, setWeatherCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorite cities from Supabase on component mount
  useEffect(() => {
    const loadFavoriteCities = async () => {
      try {
        const favoriteCities = await getFavoriteCities();
        console.log('Loaded favorite cities:', favoriteCities);
        
        // Fetch weather data for each favorite city
        if (favoriteCities && favoriteCities.length > 0) {
          const weatherPromises = favoriteCities.map(city => fetchWeatherData(city));
          const weatherData = await Promise.all(weatherPromises);
          
          // Filter out any failed requests (null values)
          const validWeatherCards = weatherData.filter(card => card !== null);
          setWeatherCards(validWeatherCards);
        }
      } catch (error) {
        console.error('Error loading favorite cities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoriteCities();
  }, []);

  // Helper function to fetch weather data for a city
  const fetchWeatherData = async (city) => {
    try {
      const apiKey = import.meta.env.VITE_APP_ID;
      
      if (!apiKey) {
        console.error("VITE_APP_ID is not defined");
        return null;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        console.error(`Error fetching weather for ${city}:`, data.message);
        return null;
      }

      return {
        id: Date.now() + Math.random(), // Ensure unique ID
        temperature: Math.floor(data.main.temp),
        location: data.name,
        condition: data.weather[0].main,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        humidity: data.main.humidity,
        windSpeed: Math.floor(data.wind.speed),
        precipitation: data.rain ? Math.floor(data.rain['1h'] || 0) : 0,
      };
    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error);
      return null;
    }
  };

  const addWeatherCard = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }

    // Check if city already exists
    if (weatherCards.some(card => card.location.toLowerCase() === city.toLowerCase())) {
      alert("City already added!");
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_APP_ID;
      
      if (!apiKey) {
        alert("API key is missing. Please check your .env file.");
        console.error("VITE_APP_ID is not defined");
        return;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      console.log("Fetching weather for:", city);
      
      const response = await fetch(url);
      const data = await response.json();

      console.log("API Response:", response.status, data);

      if (!response.ok) {
        alert(data.message || "Error fetching weather data");
        return;
      }

      const newCard = {
        id: Date.now(),
        temperature: Math.floor(data.main.temp),
        location: data.name,
        condition: data.weather[0].main,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        humidity: data.main.humidity,
        windSpeed: Math.floor(data.wind.speed),
        precipitation: data.rain ? Math.floor(data.rain['1h'] || 0) : 0,
      };

      // Add to Supabase
      const result = await addFavoriteCity(data.name);
      
      if (result.success) {
        setWeatherCards([...weatherCards, newCard]);
        console.log('City added to favorites:', data.name);
      } else {
        alert(result.message || "Failed to add city to favorites");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please try again.");
    }
  };

  const removeWeatherCard = async (id, location) => {
    try {
      // Remove from Supabase
      const result = await removeFavoriteCity(location);
      
      if (result.success) {
        // Remove from local state
        setWeatherCards(weatherCards.filter(card => card.id !== id));
        console.log('City removed from favorites:', location);
      } else {
        alert(result.message || "Failed to remove city from favorites");
      }
    } catch (error) {
      console.error("Error removing city:", error);
      alert("Error removing city. Please try again.");
    }
  };

  return (
    <div className="app">
      <SearchBar onSearch={addWeatherCard} />
      <div className="weather-cards-container">
        {isLoading ? (
          <div className="no-cities">
            <p>Loading favorite cities...</p>
          </div>
        ) : weatherCards.length === 0 ? (
          <div className="no-cities">
            <p>Search for a city to see weather information</p>
          </div>
        ) : (
          weatherCards.map(card => (
            <WeatherCard
              key={card.id}
              {...card}
              onRemove={() => removeWeatherCard(card.id, card.location)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
