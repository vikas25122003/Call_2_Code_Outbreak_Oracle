import React from 'react';
import { useAppContext } from '../context/AppContext';
import './TipsCard.css';

const TipsCard: React.FC = () => {
  const { state } = useAppContext();
  const { riskData } = state;

  const getTipsByRiskLevel = (level: string) => {
    const baseTips = [
      {
        icon: '🧼',
        title: 'Wash Hands Frequently',
        description: 'Use soap and water for at least 20 seconds, especially after being in public places.'
      },
      {
        icon: '😷',
        title: 'Wear Face Masks',
        description: 'Use masks in crowded areas and when social distancing is not possible.'
      },
      {
        icon: '📏',
        title: 'Maintain Social Distance',
        description: 'Keep at least 6 feet distance from others, especially in indoor settings.'
      }
    ];

    const mediumRiskTips = [
      {
        icon: '🏠',
        title: 'Limit Indoor Gatherings',
        description: 'Avoid large indoor gatherings and ensure proper ventilation in enclosed spaces.'
      },
      {
        icon: '🌡️',
        title: 'Monitor Symptoms',
        description: 'Stay alert for symptoms and get tested if you experience any signs of illness.'
      }
    ];

    const highRiskTips = [
      {
        icon: '🏥',
        title: 'Seek Medical Attention',
        description: 'Contact healthcare providers immediately if you experience severe symptoms.'
      },
      {
        icon: '🚫',
        title: 'Avoid Non-Essential Travel',
        description: 'Postpone travel plans and avoid visiting high-risk areas.'
      },
      {
        icon: '💉',
        title: 'Get Vaccinated',
        description: 'Ensure you are up to date with all recommended vaccinations.'
      }
    ];

    switch (level) {
      case 'HIGH':
        return [...baseTips, ...mediumRiskTips, ...highRiskTips];
      case 'MEDIUM':
        return [...baseTips, ...mediumRiskTips];
      case 'LOW':
        return baseTips;
      default:
        return baseTips;
    }
  };

  const getWeatherTips = (weatherData: any) => {
    const tips = [];
    
    if (weatherData.temperature > 30) {
      tips.push({
        icon: '🌡️',
        title: 'High Temperature Alert',
        description: 'Stay hydrated and avoid prolonged sun exposure. High temperatures can weaken immune response.'
      });
    }
    
    if (weatherData.humidity > 80) {
      tips.push({
        icon: '💧',
        title: 'High Humidity Warning',
        description: 'High humidity can promote the growth of mold and bacteria. Use dehumidifiers indoors.'
      });
    }
    
    if (weatherData.airQuality > 150) {
      tips.push({
        icon: '🌬️',
        title: 'Poor Air Quality',
        description: 'Limit outdoor activities and use air purifiers indoors. Poor air quality can worsen respiratory conditions.'
      });
    }
    
    return tips;
  };

  const tips = riskData ? [
    ...getTipsByRiskLevel(riskData.riskLevel),
    ...(riskData.weatherData ? getWeatherTips(riskData.weatherData) : [])
  ] : [];

  if (!riskData) {
    return (
      <div className="tips-card">
        <div className="tips-header">
          <h2>💡 Health Tips</h2>
        </div>
        <div className="tips-placeholder">
          <p>Select a location to get personalized health tips based on local conditions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tips-card">
      <div className="tips-header">
        <h2>💡 Health Tips</h2>
        <div className="risk-badge" style={{
          backgroundColor: riskData.riskLevel === 'HIGH' ? '#f44336' : 
                          riskData.riskLevel === 'MEDIUM' ? '#ff9800' : '#4caf50'
        }}>
          {riskData.riskLevel} Risk Level
        </div>
      </div>
      
      <div className="tips-content">
        <div className="tips-grid">
          {tips.map((tip, index) => (
            <div key={index} className="tip-item">
              <div className="tip-icon">{tip.icon}</div>
              <div className="tip-content">
                <h3>{tip.title}</h3>
                <p>{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="emergency-info">
          <h3>🚨 Emergency Information</h3>
          <div className="emergency-grid">
            <div className="emergency-item">
              <strong>Local Health Department:</strong>
              <span>Contact your local health authority for the latest updates</span>
            </div>
            <div className="emergency-item">
              <strong>Emergency Hotline:</strong>
              <span>911 (US) or your local emergency number</span>
            </div>
            <div className="emergency-item">
              <strong>COVID-19 Hotline:</strong>
              <span>1-800-CDC-INFO (US) or check local resources</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsCard; 