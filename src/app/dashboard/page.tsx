// dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { WatchlistItem } from '@/app/lib/types';
import WatchlistGrid from '@/app/components/ui/WatchlistGrid';
import AddStockModal from '@/app/components/ui/AddStockModal';

export default function DashboardPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for better UX
  const [error, setError] = useState<string | null>(null); // Handle errors

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    console.log("📡 Fetching watchlist...");
    try {
      const response = await fetch('/api/watchlist');
      const data = await response.json();
      
      console.log("✅ Watchlist response:", data);
      setWatchlist(data);
    } catch (error) {
      console.error("❌ Error fetching watchlist:", error);
    }
  };  

  const handleAddStock = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);
  
      // Check if the stock already exists in the watchlist
      if (watchlist.some(stock => stock.symbol === symbol)) {
        setError(`Stock ${symbol} is already in the watchlist.`);
        setLoading(false);
        return;
      }
  
      const validationResponse = await fetch(
        // `https://financialmodelingprep.com/api/v3/search?query=${symbol}&apikey=ffKCoecQGIlnpGCjGjrnBJDdF0rjMReX`
        // `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=YOSD45O2747TAZ17`
        `https://api.twelvedata.com/symbol_search?symbol=${symbol}`
      );
      const validationData = await validationResponse.json();
  
      if (!validationData.length) {
        setError(`Stock ${symbol} not found.`);
        setLoading(false);
        return;
      }
  
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        body: JSON.stringify({ symbol }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Failed to add stock:', errorMessage);
        throw new Error(`Failed to add stock: ${errorMessage}`);
      }
  
      await fetchWatchlist();
      setIsAddModalOpen(false);
    } catch (error) {
      setError('Error adding stock');
      console.error('❌ Add error:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleRemoveStock = async (stockId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/watchlist', {
        method: 'DELETE',
        body: JSON.stringify({ stockId }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to remove stock');
      }

      await fetchWatchlist();
    } catch (error) {
      setError('Error removing stock');
      console.error('❌ Remove error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Watchlist</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Loading...' : 'Add Stock'}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>} {/* Show error message */}
      
      {/* {loading && <p>Loading watchlist...</p>} */}
      
      {!loading && watchlist.length === 0 && <p>No stocks in your watchlist.</p>}

      <WatchlistGrid items={watchlist} onRemoveStock={handleRemoveStock} />

      {isAddModalOpen && (
        <AddStockModal onAdd={handleAddStock} onClose={() => setIsAddModalOpen(false)}  watchlist={watchlist.map(stock => stock.symbol)} />
      )}
    </div>
  );
}
