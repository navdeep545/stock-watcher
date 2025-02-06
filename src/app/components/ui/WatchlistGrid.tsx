import { WatchlistItem } from '@/app/lib/types';
import StockCard from './StockCard';

interface WatchlistGridProps {
  items: WatchlistItem[];
  onRemoveStock: (stockId: string) => void;
}

export default function WatchlistGrid({ items, onRemoveStock }: WatchlistGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No stocks in your watchlist. Add some stocks to get started!
      </div>
    );
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
