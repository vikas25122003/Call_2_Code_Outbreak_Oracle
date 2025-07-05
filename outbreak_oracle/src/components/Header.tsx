import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { getUserLocation, fetchLocationData } from '../utils/api';
import './Header.css';

const Header: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLocationDetect = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const location = await getUserLocation();
      dispatch({ type: 'SET_LOCATION', payload: location });
      
      const riskData = await fetchLocationData(location);
      dispatch({ type: 'SET_RISK_DATA', payload: riskData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to detect location' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // For demo purposes, we'll use a mock location based on search
      // In a real app, you'd use a geocoding API
      const mockLocation = {
        lat: 40.7128,
        lng: -74.0060,
        city: searchQuery,
        country: 'United States'
      };
      
      dispatch({ type: 'SET_LOCATION', payload: mockLocation });
      
      const riskData = await fetchLocationData(mockLocation);
      dispatch({ type: 'SET_RISK_DATA', payload: riskData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch data for location' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🦠</span>
          <h1>Outbreak Oracle</h1>
        </div>
        
        <div className="location-controls">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Enter city name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              disabled={state.loading}
            />
            <button type="submit" className="search-btn" disabled={state.loading}>
              Search
            </button>
          </form>
          
          <button
            onClick={handleLocationDetect}
            className="detect-btn"
            disabled={state.loading}
          >
            📍 Detect My Location
          </button>
        </div>
        
        {state.location && (
          <div className="current-location">
            📍 {state.location.city}, {state.location.country}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 