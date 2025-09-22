import { createHttpClient } from './httpClient';
import { createCacheService } from './cacheService';
import { API_ENDPOINTS, DEFAULT_CURRENCY } from '../constants/api';

// Data adapters to transform API responses to domain models
export const adaptCoinFromApi = (apiCoin) => ({
  id: apiCoin.id,
  symbol: apiCoin.symbol,
  name: apiCoin.name,
  image: apiCoin.image,
  currentPrice: apiCoin.current_price,
  marketCap: apiCoin.market_cap,
  marketCapRank: apiCoin.market_cap_rank,
  fullyDilutedValuation: apiCoin.fully_diluted_valuation,
  totalVolume: apiCoin.total_volume,
  high24h: apiCoin.high_24h,
  low24h: apiCoin.low_24h,
  priceChange24h: apiCoin.price_change_24h,
  priceChangePercentage24h: apiCoin.price_change_percentage_24h,
  marketCapChange24h: apiCoin.market_cap_change_24h,
  marketCapChangePercentage24h: apiCoin.market_cap_change_percentage_24h,
  circulatingSupply: apiCoin.circulating_supply,
  totalSupply: apiCoin.total_supply,
  maxSupply: apiCoin.max_supply,
  ath: apiCoin.ath,
  athChangePercentage: apiCoin.ath_change_percentage,
  athDate: apiCoin.ath_date,
  atl: apiCoin.atl,
  atlChangePercentage: apiCoin.atl_change_percentage,
  atlDate: apiCoin.atl_date,
  lastUpdated: apiCoin.last_updated,
});

export const adaptCoinsFromApi = (apiCoins) => apiCoins.map(adaptCoinFromApi);

export const adaptTrendingCoinFromApi = (apiTrendingItem) => {
  const item = apiTrendingItem.item;
  return {
    id: item.id,
    coinId: item.coin_id,
    name: item.name,
    symbol: item.symbol,
    marketCapRank: item.market_cap_rank,
    thumb: item.thumb,
    small: item.small,
    large: item.large,
    slug: item.slug,
    priceBtc: item.price_btc,
    score: item.score,
  };
};

export const adaptTrendingCoinsFromApi = (apiTrendingResponse) =>
  apiTrendingResponse.coins.map(adaptTrendingCoinFromApi);

export const createCoinGeckoService = () => {
  const httpClient = createHttpClient();
  const cache = createCacheService();

  const getCoinsMarkets = async (params = {}) => {
    const defaultParams = {
      vs_currency: DEFAULT_CURRENCY,
      order: 'market_cap_desc',
      per_page: 50,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h',
    };

    const finalParams = { ...defaultParams, ...params };
    const cacheKey = `coins_markets_${JSON.stringify(finalParams)}`;

    // Try to get from cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await httpClient.get(API_ENDPOINTS.COINS_MARKETS, {
        params: finalParams,
      });

      const coins = adaptCoinsFromApi(response);

      // Cache the result
      cache.set(cacheKey, coins);

      return coins;
      
    } catch (error) {
      console.error('Error fetching coins markets:', error);
      throw error;
    }
  };

  const getTrendingCoins = async () => {
    const cacheKey = 'trending_coins';

    // Try to get from cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await httpClient.get(API_ENDPOINTS.TRENDING);
      const trendingCoins = adaptTrendingCoinsFromApi(response);

      // Cache the result
      cache.set(cacheKey, trendingCoins);

      return trendingCoins;
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      throw error;
    }
  };

  const getCoinDetails = async (coinId) => {
    const cacheKey = `coin_details_${coinId}`;

    // Try to get from cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await httpClient.get(API_ENDPOINTS.COIN_DETAIL(coinId));

      // Cache the result with shorter TTL for detailed data
      cache.set(cacheKey, response, 30000); // 30 seconds

      return response;
    } catch (error) {
      console.error(`Error fetching coin details for ${coinId}:`, error);
      throw error;
    }
  };

  const getTopGainers = async (limit = 10) => {
    const coins = await getCoinsMarkets({
      order: 'percent_change_24h_desc',
      per_page: limit,
    });

    return coins.filter(coin => coin.priceChangePercentage24h > 0);
  };

  const getTopLosers = async (limit = 10) => {
    const coins = await getCoinsMarkets({
      order: 'percent_change_24h_asc',
      per_page: limit,
    });

    return coins.filter(coin => coin.priceChangePercentage24h < 0);
  };

  const getHighestVolume = async (limit = 10) => {
    return await getCoinsMarkets({
      order: 'volume_desc',
      per_page: limit,
    });
  };

  const searchCoins = async (query, allCoins = []) => {
    if (!query || query.trim() === '') {
      return allCoins;
    }

    const searchTerm = query.toLowerCase().trim();

    return allCoins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm) ||
      coin.symbol.toLowerCase().includes(searchTerm)
    );
  };

  const clearCache = () => {
    cache.clear();
  };

  const getCacheStats = () => {
    return cache.getStats();
  };

  return {
    getCoinsMarkets,
    getTrendingCoins,
    getCoinDetails,
    getTopGainers,
    getTopLosers,
    getHighestVolume,
    searchCoins,
    clearCache,
    getCacheStats
  };
};