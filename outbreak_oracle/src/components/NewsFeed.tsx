import React from 'react';
import { useAppContext } from '../context/AppContext';
import './NewsFeed.css';

const NewsFeed: React.FC = () => {
  const { state } = useAppContext();
  const { riskData, location } = state;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!riskData || !riskData.newsData || riskData.newsData.length === 0) {
    return (
      <div className="news-feed">
        <div className="news-header">
          <h2>📰 Health News</h2>
        </div>
        <div className="news-placeholder">
          <p>No health news available for this location at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-feed">
      <div className="news-header">
        <h2>📰 Health News</h2>
        {location && (
          <span className="location-tag">
            📍 {location.city}, {location.country}
          </span>
        )}
      </div>
      
      <div className="news-content">
        <div className="news-grid">
          {riskData.newsData.map((article, index) => (
            <article key={index} className="news-item">
              <div className="news-meta">
                <span className="news-date">{formatDate(article.publishedAt)}</span>
                <span className="news-source">Health News</span>
              </div>
              
              <h3 className="news-title">
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="news-link"
                >
                  {article.title}
                </a>
              </h3>
              
              <p className="news-description">
                {article.description.length > 150 
                  ? `${article.description.substring(0, 150)}...` 
                  : article.description
                }
              </p>
              
              <div className="news-footer">
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="read-more"
                >
                  Read Full Article →
                </a>
              </div>
            </article>
          ))}
        </div>
        
        <div className="news-disclaimer">
          <p>
            <strong>Disclaimer:</strong> News articles are sourced from public APIs and may not reflect the most current information. 
            Always verify information with official health authorities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed; 