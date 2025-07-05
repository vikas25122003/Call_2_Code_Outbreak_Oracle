import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { LocationData, RiskData } from '../utils/api';

interface AppState {
  location: LocationData | null;
  riskData: RiskData | null;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOCATION'; payload: LocationData }
  | { type: 'SET_RISK_DATA'; payload: RiskData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: AppState = {
  location: null,
  riskData: null,
  loading: false,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, location: action.payload, error: null };
    case 'SET_RISK_DATA':
      return { ...state, riskData: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}; 