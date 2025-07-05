import React from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import RiskPanel from './components/RiskPanel';
import MapView from './components/MapView';
import TipsCard from './components/TipsCard';
import NewsFeed from './components/NewsFeed';
import Loader from './components/Loader';
import Chatbot from './components/Chatbot';
import { useAppContext } from './context/AppContext';
import './App.css';

const AppContent: React.FC = () => {
  const { state } = useAppContext();
  const { loading, error } = state;

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          {error && (
            <div className="error-message">
              <h3>⚠️ Error</h3>
              <p>{error}</p>
            </div>
          )}
          
          {loading && <Loader message="Fetching location data and analyzing risk factors..." />}
          
          {!loading && !error && (
            <>
              <RiskPanel />
              <MapView />
              <TipsCard />
              <NewsFeed />
            </>
          )}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>
            <strong>Outbreak Oracle</strong> - Disease outbreak risk assessment tool
          </p>
          <p className="footer-disclaimer">
            This application provides risk assessments based on publicly available data. 
            Always consult with healthcare professionals for medical advice.
          </p>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
