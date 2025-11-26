import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import './App.css';

const App = () => {
  const [weatherCards, setWeatherCards] = useState([]);

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

      setWeatherCards([...weatherCards, newCard]);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please try again.");
    }
  };

  const removeWeatherCard = (id) => {
    setWeatherCards(weatherCards.filter(card => card.id !== id));
  };

  return (
    <div className="app">
      <SearchBar onSearch={addWeatherCard} />
      <div className="weather-cards-container">
        {weatherCards.length === 0 ? (
          <div className="no-cities">
            <p>Search for a city to see weather information</p>
          </div>
        ) : (
          weatherCards.map(card => (
            <WeatherCard
              key={card.id}
              {...card}
              onRemove={() => removeWeatherCard(card.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
