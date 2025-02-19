import { useEffect, useState } from 'react';
import { WatchlistItem } from '@/app/lib/types';
import StockCard from './StockCard';

interface WatchlistGridProps {
  items: WatchlistItem[];
  onRemoveStock: (stockId: string) => void;
}

export default function WatchlistGrid({ items, onRemoveStock }: WatchlistGridProps) {
  const [prices, setPrices] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchPrices = async () => {
      const newPrices: Record<string, string> = {};
      
      for (const item of items) {
        try {
          const response = await fetch(`https://api.twelvedata.com/price?symbol=${item.symbol}&apikey=${process.env.NEXT_PUBLIC_TWELVEDATA_API_KEY}`);
          if (response.ok) {
            const data = await response.json();
            newPrices[item.symbol] = data.price;
          }
        } catch (error) {
          console.error(`Error fetching price for ${item.symbol}:`, error);
        }
      }
      
      setPrices(newPrices);
    };
    
    if (items.length > 0) {
      fetchPrices();
      
      // Set up an interval to refresh prices every minute
      const intervalId = setInterval(fetchPrices, 60000);
      return () => clearInterval(intervalId);
    }
  }, [items]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <StockCard
          key={item.stock_id}
          stock={{
            stock_id: item.stock_id,
            symbol: item.symbol,
            price: prices[item.symbol]
          }}
          onRemove={onRemoveStock}
        />
      ))}
    </div>
  );
}