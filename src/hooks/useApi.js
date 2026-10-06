import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showLoading, hideLoading, showError } = useApp();

  const request = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      showLoading();
      setError(null);
      const response = await apiCall();
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      hideLoading();
    }
  }, [showLoading, hideLoading, showError]);

  return {
    data,
    loading,
    error,
    request
  };
};
