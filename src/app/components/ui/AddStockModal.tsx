'use client';

import { useState, useEffect } from 'react';

interface AddStockModalProps {
  onAdd: (symbol: string) => void;
  onClose: () => void;
}

export default function AddStockModal({ onAdd, onClose }: AddStockModalProps) {
  const [symbol, setSymbol] = useState('');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSymbol = symbol.trim().toUpperCase();
    if (!trimmedSymbol) return;

    onAdd(trimmedSymbol);
    setSymbol(''); // Clear input field
    onClose(); // Close modal after adding
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Stock to Watchlist</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="w-full p-2 border rounded mb-4"
            aria-label="Stock Symbol Input"
            autoFocus // Auto-focus input on modal open
          />
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
              disabled={!symbol.trim()} // Disable if input is empty
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
