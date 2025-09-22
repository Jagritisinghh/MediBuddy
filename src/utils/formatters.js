// Currency formatting utilities
export const formatCurrency = (value, currency = 'USD', minimumFractionDigits = 2) => {
  if (value === null || value === undefined) return 'N/A';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits === 0 ? 0 : 8,
    }).format(value);
  } catch (error) {
    return `$${value.toFixed(minimumFractionDigits)}`;
  }
};

// Number formatting utilities
export const formatNumber = (value, options = {}) => {
  if (value === null || value === undefined) return 'N/A';

  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  try {
    return new Intl.NumberFormat('en-US', { ...defaultOptions, ...options }).format(value);
  } catch (error) {
    return value.toString();
  }
};

// Percentage formatting
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return 'N/A';

  const formatted = value.toFixed(decimals);
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatted}%`;
};

// Market cap formatting (e.g., 1.5B, 250M)
export const formatMarketCap = (value) => {
  if (value === null || value === undefined) return 'N/A';

  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }

  return formatCurrency(value, 'USD', 0);
};

// Date formatting
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    return 'Invalid Date';
  }
};

// Time ago formatting (e.g., "2 hours ago")
export const formatTimeAgo = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  } catch (error) {
    return 'Invalid Date';
  }
};

// Debounce utility for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};