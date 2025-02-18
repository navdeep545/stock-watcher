export type User = {
  user_id: string;
  name: string;
  email: string;
  password: string;
};

export type Stock = {
  stock_id: string;
  symbol: string;
};

export type WatchlistItem = {
  watchlist_id: string;
  user_id: string;
  stock_id: string;
  symbol: string;
};

// New interfaces for price data
export interface PriceResponse {
  price: string;
}

export interface StockWithPrice extends Stock {
  price?: string;  // Optional price that's fetched in real-time
}

export interface WatchlistItemWithPrice extends WatchlistItem {
  price?: string;  // Optional price that's fetched in real-time
}