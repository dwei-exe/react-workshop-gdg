import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './SearchBar.css';
import search_icon from "../assets/search.png";

// Search bar with user info and logout button
// Handles city search and user authentication display
const SearchBar = ({ onSearch }) => {
  const inputRef = useRef();
  const { signOut, user } = useAuth();

  // Search for a city when user clicks search or presses Enter
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

  // Sign out the current user
  const handleLogout = () => signOut().catch(() => alert('Error signing out'));

  return (
    <div className="search-bar-container">
      <div className="search-bar-header">
        <h1 className="app-title">Weather App</h1>
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
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
