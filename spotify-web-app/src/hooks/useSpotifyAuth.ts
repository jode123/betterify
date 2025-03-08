import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@spotify_access_token';

export const useSpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      setAccessToken(token);
    } catch (error) {
      console.error('Error loading token:', error);
    } finally {
      setLoading(false);
    }
  };

  const setToken = async (token: string) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      setAccessToken(token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const clearToken = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setAccessToken(null);
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  };

  return {
    accessToken,
    loading,
    setToken,
    clearToken
  };
};