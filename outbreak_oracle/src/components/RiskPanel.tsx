import React from 'react';
import { useAppContext } from '../context/AppContext';
import './RiskPanel.css';

const RiskPanel: React.FC = () => {
  const { state } = useAppContext();
  const { riskData, location } = state;

  if (!riskData || !location) {
    return null;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return '#f44336';
      case 'MEDIUM': return '#ff9800';
      case 'LOW': return '#4caf50';
      default: return '#757575';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return '⚪';
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#4caf50';
    if (aqi <= 100) return '#ffeb3b';
    if (aqi <= 150) return '#ff9800';
    if (aqi <= 200) return '#f44336';
    if (aqi <= 300) return '#9c27b0';
    return '#7b1fa2';
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  return (
    <div className="risk-panel">
      <div className="risk-header">
        <h2>Risk Assessment</h2>
        <div 
          className="risk-level"
          style={{ backgroundColor: getRiskColor(riskData.riskLevel) }}
        >
          {getRiskIcon(riskData.riskLevel)} {riskData.riskLevel} RISK
        </div>
      </div>

      <div className="risk-grid">
        {/* Weather Data */}
        <div className="risk-card weather-card">
          <h3>🌤️ Weather Conditions</h3>
          {riskData.weatherData && (
            <div className="weather-data">
              <div className="weather-item">
                <span className="label">Temperature:</span>
                <span className="value">{riskData.weatherData.temperature}°C</span>
              </div>
              <div className="weather-item">
                <span className="label">Humidity:</span>
                <span className="value">{riskData.weatherData.humidity}%</span>
              </div>
              <div className="weather-item">
                <span className="label">Air Quality:</span>
                <span 
                  className="value aqi-value"
                  style={{ color: getAQIColor(riskData.weatherData.airQuality) }}
                >
                  {riskData.weatherData.airQuality} ({getAQILevel(riskData.weatherData.airQuality)})
                </span>
              </div>
              <div className="weather-item">
                <span className="label">Conditions:</span>
                <span className="value">{riskData.weatherData.description}</span>
              </div>
            </div>
          )}
        </div>

        {/* Disease Data */}
        <div className="risk-card disease-card">
          <h3>🦠 Disease Statistics</h3>
          {riskData.diseaseData && (
            <div className="disease-data">
              <div className="disease-item">
                <span className="label">Total Cases:</span>
                <span className="value">{riskData.diseaseData.cases.toLocaleString()}</span>
              </div>
              <div className="disease-item">
                <span className="label">Active Cases:</span>
                <span className="value">{riskData.diseaseData.active.toLocaleString()}</span>
              </div>
              <div className="disease-item">
                <span className="label">Cases per Million:</span>
                <span className="value">{riskData.diseaseData.casesPerOneMillion.toLocaleString()}</span>
              </div>
              <div className="disease-item">
                <span className="label">Population:</span>
                <span className="value">{riskData.diseaseData.population.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Risk Factors */}
        <div className="risk-card factors-card">
          <h3>⚠️ Risk Factors</h3>
          <div className="risk-factors">
            <div className="factor">
              <span className="factor-icon">🦠</span>
              <span className="factor-text">Disease Spread</span>
              <span className="factor-score">{riskData.riskScore >= 2 ? 'High' : 'Low'}</span>
            </div>
            <div className="factor">
              <span className="factor-icon">🌡️</span>
              <span className="factor-text">Temperature</span>
              <span className="factor-score">
                {riskData.weatherData && riskData.weatherData.temperature > 30 ? 'High' : 'Normal'}
              </span>
            </div>
            <div className="factor">
              <span className="factor-icon">💧</span>
              <span className="factor-text">Humidity</span>
              <span className="factor-score">
                {riskData.weatherData && riskData.weatherData.humidity > 80 ? 'High' : 'Normal'}
              </span>
            </div>
            <div className="factor">
              <span className="factor-icon">🌬️</span>
              <span className="factor-text">Air Quality</span>
              <span className="factor-score">
                {riskData.weatherData && riskData.weatherData.airQuality > 150 ? 'Poor' : 'Good'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskPanel; 