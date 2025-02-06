import { Stock } from '@/app/lib/types';

interface StockCardProps {
  stock: Stock;
  onRemove: (stockId: string) => void;
}

export default function StockCard({ stock, onRemove }: StockCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{stock.symbol}</h3>
        <button
          onClick={() => onRemove(stock.stock_id)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
}