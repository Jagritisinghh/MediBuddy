import React, { useState } from 'react';
import HighlightsSection from './components/HighlightsSection/HighlightsSection';
import CoinTable from './components/CoinTable/CoinTable';
import CoinDetailModal from './components/CoinDetailModal/CoinDetailModal';

const Header = () => (
  <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
           Crypto Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Track cryptocurrency prices, market trends, and highlights in real-time
        </p>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-200 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Built with love using React and CoinGecko API
        </p>
        <p className="text-xs text-gray-500">
          Data provided by CoinGecko • Updated every minute
        </p>
      </div>
    </div>
  </footer>
);

function App() {
  const [selectedCoin, setSelectedCoin] = useState(null);

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
  };

  const handleCloseModal = () => {
    setSelectedCoin(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {/* Market Highlights Section  */}
        <section aria-label="Market highlights">
          <HighlightsSection onCoinClick={handleCoinClick} />
        </section>

        { /* All Coins Table Section */}
        <section aria-label="All cryptocurrencies">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Cryptocurrencies</h2>
            <p className="text-gray-600">
              Explore all available cryptocurrencies with real-time pricing and market data
            </p>
          </div>
          <CoinTable onCoinClick={handleCoinClick} />
        </section>
      </main>

      <Footer />

      {/* Coin Detail Modal */}
      {selectedCoin && (
        <CoinDetailModal
          coin={selectedCoin}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
