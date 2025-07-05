import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useAppContext } from '../context/AppContext';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView: React.FC = () => {
  const { state } = useAppContext();
  const { location, riskData } = state;
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    if (location) {
      setMapKey(prev => prev + 1);
    }
  }, [location]);

  if (!location) {
    return (
      <div className="map-container">
        <div className="map-placeholder">
          <div className="placeholder-content">
            <span className="placeholder-icon">🗺️</span>
            <h3>Interactive Map</h3>
            <p>Select a location to view the interactive map with risk assessment data.</p>
          </div>
        </div>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return '#f44336';
      case 'MEDIUM': return '#ff9800';
      case 'LOW': return '#4caf50';
      default: return '#757575';
    }
  };

  const getRiskRadius = (level: string) => {
    switch (level) {
      case 'HIGH': return 5000;
      case 'MEDIUM': return 3000;
      case 'LOW': return 1000;
      default: return 2000;
    }
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <h2>🗺️ Interactive Risk Map</h2>
        <p>Showing risk assessment for {location.city}, {location.country}</p>
      </div>
      
      <MapContainer
        key={mapKey}
        center={[location.lat, location.lng]}
        zoom={10}
        className="map"
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Main location marker */}
        <Marker position={[location.lat, location.lng]}>
          <Popup>
            <div className="map-popup">
              <h3>{location.city}, {location.country}</h3>
              {riskData && (
                <>
                  <p><strong>Risk Level:</strong> {riskData.riskLevel}</p>
                  {riskData.weatherData && (
                    <p><strong>Temperature:</strong> {riskData.weatherData.temperature}°C</p>
                  )}
                  {riskData.diseaseData && (
                    <p><strong>Cases:</strong> {riskData.diseaseData.cases.toLocaleString()}</p>
                  )}
                </>
              )}
            </div>
          </Popup>
        </Marker>

        {/* Risk zone circle */}
        {riskData && (
          <Circle
            center={[location.lat, location.lng]}
            radius={getRiskRadius(riskData.riskLevel)}
            pathOptions={{
              color: getRiskColor(riskData.riskLevel),
              fillColor: getRiskColor(riskData.riskLevel),
              fillOpacity: 0.2,
              weight: 2
            }}
          >
            <Popup>
              <div className="map-popup">
                <h3>Risk Zone</h3>
                <p><strong>Level:</strong> {riskData.riskLevel}</p>
                <p><strong>Radius:</strong> {(getRiskRadius(riskData.riskLevel) / 1000).toFixed(1)} km</p>
              </div>
            </Popup>
          </Circle>
        )}

        {/* Mock nearby locations for demo */}
        {riskData && riskData.riskLevel === 'HIGH' && (
          <>
            <Marker position={[location.lat + 0.01, location.lng + 0.01]}>
              <Popup>
                <div className="map-popup">
                  <h3>Nearby Hospital</h3>
                  <p>Medical facility monitoring cases</p>
                </div>
              </Popup>
            </Marker>
            <Marker position={[location.lat - 0.008, location.lng - 0.005]}>
              <Popup>
                <div className="map-popup">
                  <h3>Testing Center</h3>
                  <p>COVID-19 testing facility</p>
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4caf50' }}></div>
          <span>Low Risk</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff9800' }}></div>
          <span>Medium Risk</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f44336' }}></div>
          <span>High Risk</span>
        </div>
      </div>
    </div>
  );
};

export default MapView; 