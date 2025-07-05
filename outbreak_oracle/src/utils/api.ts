import axios from 'axios';

// API Base URLs
const DISEASE_API_BASE = 'https://disease.sh/v3/covid-19';
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';
const NEWS_API_BASE = 'https://newsapi.org/v2';
const OPENAQ_API_BASE = 'https://api.openaq.org/v2';

// API keys from environment variables
const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'demo';
const OPENAQ_API_KEY = import.meta.env.VITE_OPENAQ_API_KEY || 'demo';

export interface LocationData {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

export interface DiseaseData {
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  population: number;
  casesPerOneMillion: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  airQuality: number;
  description: string;
}

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

export interface RiskData {
  diseaseData: DiseaseData | null;
  weatherData: WeatherData | null;
  newsData: NewsItem[];
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Get user's location
export const getUserLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocoding to get city name
            const response = await axios.get(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const { city, countryName } = response.data;
            resolve({
              lat: latitude,
              lng: longitude,
              city: city || 'Unknown City',
              country: countryName || 'Unknown Country'
            });
          } catch (error) {
            resolve({
              lat: latitude,
              lng: longitude,
              city: 'Unknown City',
              country: 'Unknown Country'
            });
          }
        },
        (_error) => {
          // Fallback to IP-based location
          getLocationByIP().then(resolve).catch(reject);
        }
      );
    } else {
      getLocationByIP().then(resolve).catch(reject);
    }
  });
};

// Get location by IP (fallback)
const getLocationByIP = async (): Promise<LocationData> => {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    return {
      lat: response.data.latitude,
      lng: response.data.longitude,
      city: response.data.city,
      country: response.data.country_name
    };
  } catch (error) {
    // Default to a major city if all else fails
    return {
      lat: 40.7128,
      lng: -74.0060,
      city: 'New York',
      country: 'United States'
    };
  }
};

// Fetch disease data
export const fetchDiseaseData = async (country: string): Promise<DiseaseData | null> => {
  try {
    const response = await axios.get(`${DISEASE_API_BASE}/countries/${country}`);
    return {
      cases: response.data.cases,
      deaths: response.data.deaths,
      recovered: response.data.recovered,
      active: response.data.active,
      population: response.data.population,
      casesPerOneMillion: response.data.casesPerOneMillion
    };
  } catch (error) {
    console.error('Error fetching disease data:', error);
    return null;
  }
};

// Fetch weather data
export const fetchWeatherData = async (lat: number, lng: number): Promise<WeatherData | null> => {
  try {
    const response = await axios.get(
      `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    // Fetch real air quality data from OpenAQ
    let aqi = 100; // Default fallback
    try {
      const aqiResponse = await axios.get(
        `${OPENAQ_API_BASE}/latest?coordinates=${lat},${lng}&radius=10000&limit=1`,
        {
          headers: {
            'X-API-Key': OPENAQ_API_KEY
          }
        }
      );
      
      if (aqiResponse.data.results && aqiResponse.data.results.length > 0) {
        const measurements = aqiResponse.data.results[0].measurements;
        if (measurements && measurements.length > 0) {
          // Find PM2.5 or PM10 measurement
          const pm25 = measurements.find((m: any) => m.parameter === 'pm25');
          const pm10 = measurements.find((m: any) => m.parameter === 'pm10');
          
          if (pm25) {
            aqi = pm25.value;
          } else if (pm10) {
            aqi = pm10.value;
          }
        }
      }
    } catch (aqiError) {
      console.warn('OpenAQ API error, using fallback AQI:', aqiError);
      // Use a reasonable fallback based on weather conditions
      aqi = response.data.main.temp > 30 ? 120 : 80;
    }
    
    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      airQuality: Math.round(aqi),
      description: response.data.weather[0].description
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return mock data if API fails
    return {
      temperature: 25,
      humidity: 60,
      airQuality: 100,
      description: 'Partly cloudy'
    };
  }
};

// Fetch health news
export const fetchHealthNews = async (location: string): Promise<NewsItem[]> => {
  try {
    const response = await axios.get(
      `${NEWS_API_BASE}/everything?q=health+disease+outbreak+${location}&apiKey=${NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=5`
    );
    
    if (response.data.articles && response.data.articles.length > 0) {
      return response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description || 'No description available',
        url: article.url,
        publishedAt: article.publishedAt
      }));
    } else {
      // Fallback to general health news if no location-specific news
      const fallbackResponse = await axios.get(
        `${NEWS_API_BASE}/everything?q=health+disease+outbreak&apiKey=${NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=5`
      );
      
      return fallbackResponse.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description || 'No description available',
        url: article.url,
        publishedAt: article.publishedAt
      }));
    }
  } catch (error) {
    console.error('Error fetching news data:', error);
    // Return mock news data
    return [
      {
        title: 'Local Health Authorities Monitor Seasonal Illness Trends',
        description: 'Health officials are closely monitoring the spread of seasonal illnesses in the region.',
        url: '#',
        publishedAt: new Date().toISOString()
      },
      {
        title: 'Preventive Measures Recommended for Respiratory Health',
        description: 'Experts recommend maintaining good hygiene practices and staying updated on vaccinations.',
        url: '#',
        publishedAt: new Date().toISOString()
      }
    ];
  }
};

// Calculate risk score
export const calculateRiskScore = (
  diseaseData: DiseaseData | null,
  weatherData: WeatherData | null
): { score: number; level: 'LOW' | 'MEDIUM' | 'HIGH' } => {
  let score = 0;

  // Disease risk factors
  if (diseaseData) {
    const casesPer1000 = diseaseData.casesPerOneMillion / 1000;
    if (casesPer1000 > 10) score += 2;
    else if (casesPer1000 > 5) score += 1;
  }

  // Weather risk factors
  if (weatherData) {
    if (weatherData.airQuality > 150) score += 1;
    if (weatherData.humidity > 80 && weatherData.temperature > 30) score += 1;
    if (weatherData.temperature > 35) score += 1;
  }

  // Determine risk level
  let level: 'LOW' | 'MEDIUM' | 'HIGH';
  if (score >= 3) level = 'HIGH';
  else if (score >= 2) level = 'MEDIUM';
  else level = 'LOW';

  return { score, level };
};

// Fetch all data for a location
export const fetchLocationData = async (location: LocationData): Promise<RiskData> => {
  const [diseaseData, weatherData, newsData] = await Promise.all([
    fetchDiseaseData(location.country),
    fetchWeatherData(location.lat, location.lng),
    fetchHealthNews(location.city)
  ]);

  const { score, level } = calculateRiskScore(diseaseData, weatherData);

  return {
    diseaseData,
    weatherData,
    newsData,
    riskScore: score,
    riskLevel: level
  };
}; 