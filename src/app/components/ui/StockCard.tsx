import { StockWithPrice } from '@/app/lib/types';

interface StockCardProps {
  stock: StockWithPrice;
  onRemove: (stockId: string) => void;
}

export default function StockCard({ stock, onRemove }: StockCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">{stock.symbol}</h3>
        <button
          onClick={() => onRemove(stock.stock_id)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
      <div>
        {stock.price ? (
          <span className="text-lg font-bold">${stock.price}</span>
        ) : (
          <span className="text-sm text-gray-400">Loading price...</span>
        )}
      </div>
    </div>
  );
}