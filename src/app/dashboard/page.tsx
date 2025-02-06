'use client';

import { useEffect, useState } from 'react';
import { WatchlistItem } from '@/app/lib/types';
import WatchlistGrid from '@/app/components/ui/WatchlistGrid';
import AddStockModal from '@/app/components/ui/AddStockModal';


export default function DashboardPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    const response = await fetch('/api/watchlist');
    const data = await response.json();
    setWatchlist(data);
  };

  const handleAddStock = async (symbol: string) => {
    await fetch('/api/watchlist', {
      method: 'POST',
      body: JSON.stringify({ symbol }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchWatchlist();
    setIsAddModalOpen(false);
  };

  const handleRemoveStock = async (stockId: string) => {
    await fetch('/api/watchlist', {
      method: 'DELETE',
      body: JSON.stringify({ stockId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchWatchlist();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Watchlist</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Stock
        </button>
      </div>

      <WatchlistGrid items={watchlist} onRemoveStock={handleRemoveStock} />
      
      {isAddModalOpen && (
        <AddStockModal
          onAdd={handleAddStock}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}