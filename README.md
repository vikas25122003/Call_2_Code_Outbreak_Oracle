# Call_2_Code_Outbreak_Oracle
Outbreak Oracle Uses Various public apis to show user real time data and let them know various hotspots and news regarding healthcare and take necessary precautions .



================================================
FILE: outbreak_oracle/README.md
================================================
# 🦠 Outbreak Oracle

A web application that predicts and highlights local disease outbreak risks using health, environmental, and mobility data via public APIs, visualized on an interactive map and dashboard.

## ✨ Features

### 🔍 Core MVP Features

- **Topic Detection / Auto-Location**: Detect user's city via geolocation or manual search
- **Health Stats**: Pull disease data from APIs like Disease.sh
- **Environmental Data**: Air quality, temperature, humidity from OpenWeather
- **Interactive Map**: Display markers/heat zones based on risk using Leaflet.js
- **Risk Score + Alerts**: Show low/medium/high risk label based on combined data
- **Prevention Tips**: Auto-generated health tips based on risk level
- **Health News Section**: Local health-related news from NewsAPI
- **Mobile Responsive**: Viewable on smartphones with simple layout

### 🎯 Risk Assessment

The app calculates risk scores based on:

- Disease cases per population
- Air Quality Index (AQI)
- Weather conditions (temperature, humidity)
- Environmental factors

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd outbreak_oracle
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
outbreak_oracle/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.tsx          # App header with location search
│   │   ├── RiskPanel.tsx       # Risk assessment display
│   │   ├── MapView.tsx         # Interactive map component
│   │   ├── TipsCard.tsx        # Health tips and advice
│   │   ├── NewsFeed.tsx        # Health news feed
│   │   └── Loader.tsx          # Loading spinner
│   ├── context/
│   │   └── AppContext.tsx      # Global state management
│   ├── utils/
│   │   └── api.ts              # API functions and data fetching
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # App entry point
├── package.json
└── README.md
```

## 🔌 APIs Used

### Public APIs

- **Disease Data**: [Disease.sh](https://disease.sh/) - COVID-19 and other disease statistics
- **Weather Data**: [OpenWeatherMap](https://openweathermap.org/) - Temperature, humidity, conditions
- **Air Quality**: Mock data (can be replaced with OpenAQ API)
- **News**: [GNews](https://gnews.io/) - Health-related news articles
- **Geolocation**: Browser geolocation + IP-based fallback

### API Keys Required

To use real data instead of mock data, you'll need to set up API keys:

1. **Copy the environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Add your API keys to the `.env` file:**

   ```env
   VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
   VITE_NEWS_API_KEY=your_newsapi_key_here
   VITE_OPENAQ_API_KEY=your_openaq_api_key_here
   ```

3. **Get API keys from:**
   - **OpenWeatherMap**: https://openweathermap.org/api (Free: 1,000 calls/day)
   - **NewsAPI**: https://newsapi.org/ (Free: 100 requests/day)
   - **OpenAQ**: https://docs.openaq.org/ (Free tier available)

## 🎨 UI/UX Features

- **Modern Design**: Clean, card-based layout with gradients
- **Responsive**: Mobile-first design that works on all devices
- **Interactive Map**: Leaflet.js integration with risk zone visualization
- **Real-time Updates**: Live data fetching and risk assessment
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 🧠 Risk Scoring Logic

The app uses a simple scoring system:

```typescript
let riskScore = 0;

// Disease risk factors
if (casesPer1000 > 10) riskScore += 2;
else if (casesPer1000 > 5) riskScore += 1;

// Weather risk factors
if (aqi > 150) riskScore += 1;
if (humidity > 80 && temp > 30) riskScore += 1;
if (temp > 35) riskScore += 1;

// Risk levels
const riskLevel = riskScore >= 3 ? "HIGH" : riskScore === 2 ? "MEDIUM" : "LOW";
```

## 🛠️ Technologies Used

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Raw CSS (no frameworks)
- **Maps**: Leaflet.js + react-leaflet
- **HTTP Client**: Axios
- **State Management**: React Context + useReducer

## 📱 Mobile Responsiveness

The app is fully responsive and optimized for:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure

- **Components**: Reusable UI components with TypeScript interfaces
- **Context**: Global state management using React Context
- **Utils**: API functions and utility functions
- **CSS**: Modular CSS files for each component

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

![image](https://github.com/user-attachments/assets/61a21eb1-f360-45b2-9c62-46c0110c94a6)
![image](https://github.com/user-attachments/assets/41e922e2-4d8f-407e-a335-4f26dbc6e673)
![image](https://github.com/user-attachments/assets/394cf340-7b59-4487-ac0e-f0e00c30cec0)
![image](https://github.com/user-attachments/assets/c170a8a2-7c11-452e-b0b5-18e399c751d1)
![image](https://github.com/user-attachments/assets/1dfb1250-2c50-448c-b420-7ea1168c527d)






