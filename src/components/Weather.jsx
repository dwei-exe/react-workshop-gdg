import React, {useEffect, useState, useRef } from 'react';
import './Weather.css';
import search_icon from "../assets/search.png";

const Weather = () => {
  const inputRef = useRef();

  const [weatherData, setWeatherData] = useState(false);
  
  const search = async (city) => {
    if (city === ""){
      alert("Enter City Name");
      return;
    }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
              alert(data.message)
            }

            console.log(data);

            setWeatherData({
              temperature: Math.floor(data.main.temp),
              location: data.name,
              icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,

            });

        } catch (error) {
          setWeatherData(false);
          console.error("Error fetching weather data:", error);
        }
    }
    useEffect(() => {
      search("London");
    }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
      </div>
      <img src ={weatherData.icon} alt ="" className='weather-icon'/>
      <p className='temperature'>{weatherData.temperature}°C</p>
      <p className='location'>{weatherData.location}</p>
    </div>
  );
};

export default Weather;