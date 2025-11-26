import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { getFavoriteCities, addFavoriteCity, removeFavoriteCity } from './lib/weatherService';
import './App.css';

const MainApp = () => {
  const [weatherCards, setWeatherCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch weather data for a city from OpenWeather API
  const fetchWeatherData = async (city) => {
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
      id: Date.now() + Math.random(),
      temperature: Math.floor(data.main.temp),
      location: data.name,
      condition: data.weather[0].main,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      humidity: data.main.humidity,
      windSpeed: Math.floor(data.wind.speed),
      precipitation: data.rain ? Math.floor(data.rain['1h'] || 0) : 0,
    };
  };

  // Load favorite cities from Supabase on component mount
  useEffect(() => {
    const loadFavoriteCities = async () => {
      try {
        const favoriteCities = await getFavoriteCities();
        
        if (favoriteCities.length > 0) {
          const weatherPromises = favoriteCities.map(city => fetchWeatherData(city));
          const weatherData = await Promise.all(weatherPromises);
          const validWeatherCards = weatherData.filter(card => card !== null);
          setWeatherCards(validWeatherCards);
        }
      } catch (error) {
        console.error('Error loading favorite cities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadFavoriteCities();
    }
  }, [user]);

  const addWeatherCard = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }

    // Check if city already exists in local state
    if (weatherCards.some(card => card.location.toLowerCase() === city.toLowerCase())) {
      alert("City already added!");
      return;
    }

    try {
      // Fetch weather data
      const newCard = await fetchWeatherData(city);
      
      if (!newCard) {
        alert("Error fetching weather data");
        return;
      }

      // Add to Supabase
      const result = await addFavoriteCity(newCard.location);
      
      if (result.success) {
        setWeatherCards([...weatherCards, newCard]);
      } else {
        alert(result.message || "Failed to add city to favorites");
      }
    } catch (error) {
      console.error("Error adding weather card:", error);
      alert("Error adding city. Please try again.");
    }
  };

  const removeWeatherCard = async (id, location) => {
    const result = await removeFavoriteCity(location);
    
    if (result.success) {
      setWeatherCards(weatherCards.filter(card => card.id !== id));
    } else {
      alert(result.message || "Failed to remove city");
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

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app">
        <div className="no-cities">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <MainApp /> : <Login />;
};

const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;
