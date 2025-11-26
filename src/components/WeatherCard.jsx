import React from 'react';
import './WeatherCard.css';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';

const WeatherCard = ({ 
  location, 
  temperature, 
  condition, 
  icon, 
  humidity, 
  windSpeed, 
  precipitation,
  onRemove 
}) => {
  return (
    <div className="weather-card">
      <button className="remove-button" onClick={onRemove} title="Remove city">
        ×
      </button>
      
      <div className="card-header">
        <h2 className="city-name">{location}</h2>
        <p className="weather-condition">{condition}</p>
      </div>

      <div className="card-main">
        <img src={icon} alt={condition} className="weather-icon" />
        <div className="temperature-display">
          <span className="temperature">{temperature}</span>
          <span className="degree-symbol">°</span>
        </div>
      </div>

      <div className="card-details">
        <div className="detail-item">
          <div className="detail-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14 8L20 9L15 14L17 20L12 17L7 20L9 14L4 9L10 8L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="detail-info">
            <p className="detail-value">{precipitation}%</p>
            <p className="detail-label">Precipitation</p>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <img src={humidity_icon} alt="humidity" />
          </div>
          <div className="detail-info">
            <p className="detail-value">{humidity}%</p>
            <p className="detail-label">Humidity</p>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">
            <img src={wind_icon} alt="wind" />
          </div>
          <div className="detail-info">
            <p className="detail-value">{windSpeed} km/h</p>
            <p className="detail-label">Wind Speed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
