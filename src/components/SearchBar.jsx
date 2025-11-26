import React, { useRef } from 'react';
import './SearchBar.css';
import search_icon from "../assets/search.png";

const SearchBar = ({ onSearch }) => {
  const inputRef = useRef();

  const handleSearch = () => {
    const city = inputRef.current.value.trim();
    if (city) {
      onSearch(city);
      inputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar-container">
      <h1 className="app-title">Weather App</h1>
      <div className="search-bar">
        <input 
          ref={inputRef} 
          type="text" 
          placeholder="Search for City" 
          onKeyPress={handleKeyPress}
        />
        <button className="search-button" onClick={handleSearch}>
          <img src={search_icon} alt="search" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
