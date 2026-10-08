import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const value = {
    isLoading,
    error,
    notification,
    showLoading,
    hideLoading,
    showError,
    showNotification,
    clearError: () => setError(null),
    clearNotification: () => setNotification(null)
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
