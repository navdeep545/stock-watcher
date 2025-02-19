// ui/addstockmodal.tsx

'use client';

import 'dotenv/config';
import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

interface AddStockModalProps {
  onAdd: (symbol: string) => void;
  onClose: () => void;
  watchlist: string[];
}

interface StockSuggestion {
  symbol: string;
  instrument_name: string;
  currency: string;
  exchange: string;
}


export default function AddStockModal({ onAdd, onClose, watchlist }: AddStockModalProps) {
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced fetch function
  const debouncedFetch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;

      return (query: string) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        return new Promise((resolve) => {
          timeoutId = setTimeout(() => {
            resolve(query);
          }, 300); // 300ms delay
        });
      };
    })(),
    []
  );


  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      // setLoading(true);
      setError(null);
      
      // Wait for debounce
      await debouncedFetch(query);
      
      const response = await fetch(
        `https://api.twelvedata.com/symbol_search?symbol=${query}` 
      );
      
      // if (!response.ok) {
      //   throw new Error('Failed to fetch suggestions');
      // }
      
      const data = await response.json();
      // console.log(data);
      if(data.status !== 'ok') {
        throw new Error('Failed to fetch suggestions');
      }

      console.log(data.data);
      setSuggestions(data.data);
    } catch {
      setError('Failed to fetch suggestions');
      setSuggestions([]);
    } finally {
      // setLoading(false);
    }
  };

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSymbol = symbol.trim().toUpperCase();
    if (!trimmedSymbol) return;

    // Check if stock already exists
    if (watchlist.includes(trimmedSymbol)) {
      setError('This stock is already in your watchlist');
      return;
    }

    onAdd(trimmedSymbol);
    setSymbol('');
    onClose();
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSymbol(value);
    setError(null);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: StockSuggestion) => {
    onAdd(suggestion.symbol);
    setSymbol('');
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div className="bg-white p-6 rounded-lg w-[32rem] shadow-lg">
    <h2 className="text-xl font-bold mb-4 text-gray-900">Add Stock to Watchlist</h2>
    <form onSubmit={handleSubmit}>
      <div className="relative mb-4">
        <input
          type="text"
          value={symbol}
          onChange={handleInputChange}
          placeholder="Enter stock symbol (e.g., AAPL)"
          className="w-full p-2 border rounded text-black placeholder-gray-500"
          aria-label="Stock Symbol Input"
          autoFocus
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />

        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <li
                key={`${suggestion.symbol}-${suggestion.exchange}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 text-gray-900 flex justify-between items-center"
              >
                <span className="font-medium w-1/4 truncate">{suggestion.symbol}</span>
                <span className="text-sm text-gray-700 w-1/4 truncate">{suggestion.exchange}</span>
                <span className="text-sm text-gray-700 w-2/4 truncate">{suggestion.instrument_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          aria-label="Cancel Add Stock"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 text-white rounded ${
            symbol.trim()
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!symbol.trim()}
          aria-label="Confirm Add Stock"
        >
          Add
        </button>
      </div>
    </form>
  </div>
</div>
  );
}