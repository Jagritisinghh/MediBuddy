export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_COINGECKO_API_BASE_URL || 'https://api.coingecko.com/api/v3',
  API_KEY: process.env.REACT_APP_COINGECKO_API_KEY,
  COINS_PER_PAGE: parseInt(process.env.REACT_APP_COINS_PER_PAGE || '50', 10),
  HIGHLIGHTS_COUNT: parseInt(process.env.REACT_APP_HIGHLIGHTS_COUNT || '10', 10),
  REQUEST_TIMEOUT: 10000,
  CACHE_DURATION: 60000, // 1 minute
};

export const API_ENDPOINTS = {
  COINS_MARKETS: '/coins/markets',
  TRENDING: '/search/trending',
  COIN_DETAIL: (id) => `/coins/${id}`,
};

export const SUPPORTED_CURRENCIES = ['usd', 'eur', 'btc'];
export const DEFAULT_CURRENCY = 'usd';

export const ORDER_OPTIONS = [
  'market_cap_desc',
  'market_cap_asc',
  'volume_desc',
  'volume_asc',
  'id_asc',
  'id_desc',
  'price_asc',
  'price_desc',
  'percent_change_24h_asc',
  'percent_change_24h_desc'
];