import { API_CONFIG } from '../constants/api';

export const createCacheService = () => {
  const cache = new Map();

  const get = (key) => {
    const entry = cache.get(key);

    if (!entry) {
      return null;
    }

    if (isExpired(key)) {
      deleteKey(key);
      return null;
    }

    console.log(` Cache HIT for key: ${key}`);
    return entry.data;
  };

  const set = (key, data, ttl = API_CONFIG.CACHE_DURATION) => {
    const entry = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    cache.set(key, entry);
    console.log(` Cache SET for key: ${key} (TTL: ${ttl}ms)`);
  };

  const deleteKey = (key) => {
    cache.delete(key);
    console.log(`Cache DELETE for key: ${key}`);
  };

  const clear = () => {
    cache.clear();
    console.log('Cache CLEARED');
  };

  const isExpired = (key) => {
    const entry = cache.get(key);

    if (!entry) {
      return true;
    }

    const now = Date.now();
    const expired = now - entry.timestamp > entry.ttl;

    if (expired) {
      console.log(`Cache EXPIRED for key: ${key}`);
    }

    return expired;
  };

  const getStats = () => {
    return {
      size: cache.size,
      keys: Array.from(cache.keys()),
    };
  };

  const cleanup = () => {
    const expiredKeys = [];

    for (const key of cache.keys()) {
      if (isExpired(key)) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => deleteKey(key));

    if (expiredKeys.length > 0) {
      console.log(`Cache cleanup removed ${expiredKeys.length} expired entries`);
    }
  };

  return {
    get,
    set,
    delete: deleteKey,
    clear,
    isExpired,
    getStats,
    cleanup
  };
};