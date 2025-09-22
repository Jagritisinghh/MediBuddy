import React, { useState, useEffect, useCallback } from 'react';
import { createCoinGeckoService } from '../../services/coinGeckoService';
import { formatCurrency, formatPercentage, formatMarketCap, formatDate } from '../../utils/formatters';

const coinGeckoService = createCoinGeckoService();

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading coin details...</span>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col justify-center items-center p-8 text-center">
    <div className="text-red-600 text-lg font-semibold mb-2">Failed to Load Details</div>
    <div className="text-gray-600 mb-4 text-sm">{error}</div>
    <button
      onClick={onRetry}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
    >
      Try Again
    </button>
  </div>
);

const CoinDetailModal = ({ coin, onClose }) => {
  const [coinDetails, setCoinDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchCoinDetails = useCallback(async () => {
    if (!coin?.id) return;

    try {
      setLoading(true);
      setError(null);
      const details = await coinGeckoService.getCoinDetails(coin.id);
      console.log(details);
      setCoinDetails(details);
    } catch (err) {
      console.error('Error fetching coin details:', err);
      setError(err.message || 'Unable to fetch coin details');
    } finally {
      setLoading(false);
    }
  }, [coin?.id]);

  useEffect(() => {
    if (coin?.id) {
      fetchCoinDetails();
    }
  }, [coin?.id, fetchCoinDetails]);

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!coin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNFNUU3RUIiLz4KPHRleHQgeD0iMTYiIHk9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTc5Nzk3IiBmb250LXNpemU9IjEyIj4/PC90ZXh0Pgo8L3N2Zz4K';
              }}
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{coin.name}</h2>
              <span className="text-gray-500 text-sm uppercase">{coin.symbol}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState error={error} onRetry={fetchCoinDetails} />
          ) : (
            <div className="p-6 space-y-6">
              {/* Price Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Current Price</h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(coin.currentPrice)}
                  </div>
                  <div className={`text-sm font-semibold ${
                    coin.priceChangePercentage24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(coin.priceChangePercentage24h)} (24h)
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Market Cap Rank</h3>
                  <div className="text-2xl font-bold text-gray-900">
                    #{coin.marketCapRank || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatMarketCap(coin.marketCap)}
                  </div>
                </div>
              </div>

              {/* Market Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-1">24h High</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(coin.high24h)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-1">24h Low</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(coin.low24h)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-1">Volume (24h)</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatMarketCap(coin.totalVolume)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-1">Circulating Supply</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {coin.circulatingSupply ? formatMarketCap(coin.circulatingSupply) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* All Time High/Low */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-800 mb-2">All Time High</h3>
                  <div className="text-xl font-bold text-green-900">
                    {formatCurrency(coin.ath)}
                  </div>
                  <div className="text-sm text-green-700">
                    {formatPercentage(coin.athChangePercentage)} from ATH
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {formatDate(coin.athDate)}
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-red-800 mb-2">All Time Low</h3>
                  <div className="text-xl font-bold text-red-900">
                    {formatCurrency(coin.atl)}
                  </div>
                  <div className="text-sm text-red-700">
                    +{formatPercentage(Math.abs(coin.atlChangePercentage))} from ATL
                  </div>
                  <div className="text-xs text-red-600 mt-1">
                    {formatDate(coin.atlDate)}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {coinDetails && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>

                  {/* Description */}
                  {coinDetails.description?.en && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Description</h4>
                      <div
                        className="text-sm text-gray-700 max-h-32 overflow-y-auto"
                        dangerouslySetInnerHTML={{
                          __html: coinDetails.description.en.replace(/<[^>]*>/g, '').slice(0, 500) + '...'
                        }}
                      />
                    </div>
                  )}

                  {/* Links */}
                  {coinDetails.links && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Links</h4>
                      <div className="flex flex-wrap gap-2">
                        {coinDetails.links.homepage?.[0] && (
                          <a
                            href={coinDetails.links.homepage[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors duration-200"
                          >
                            Website
                          </a>
                        )}
                        {coinDetails.links.twitter_screen_name && (
                          <a
                            href={`https://twitter.com/${coinDetails.links.twitter_screen_name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-sky-200 transition-colors duration-200"
                          >
                            Twitter
                          </a>
                        )}
                        {coinDetails.links.subreddit_url && (
                          <a
                            href={coinDetails.links.subreddit_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-orange-200 transition-colors duration-200"
                          >
                            Reddit
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Last Updated */}
              <div className="text-xs text-gray-500 text-center border-t border-gray-200 pt-4">
                Last updated: {formatDate(coin.lastUpdated)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinDetailModal;