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
