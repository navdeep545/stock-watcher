import { WatchlistItem } from '@/app/lib/types';
import StockCard from './StockCard';

interface WatchlistGridProps {
  items: WatchlistItem[];
  onRemoveStock: (stockId: string) => void;
}

export default function WatchlistGrid({ items, onRemoveStock }: WatchlistGridProps) {
  console.log("Watchlist items:", items); // Debugging step

  if (!Array.isArray(items)) {
    return <div className="text-center py-8 text-red-500">Error: Watchlist data is invalid.</div>;
  }

  if (items.length === 0) {
    return <div className="text-center py-8 text-gray-500">No stocks in your watchlist.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <StockCard
          key={item.watchlist_id}
          stock={{ stock_id: item.stock_id, symbol: item.symbol }}
          onRemove={onRemoveStock}
        />
      ))}
    </div>
  );
}

