import { sql } from '@vercel/postgres';

export async function initializeTables() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255)
      );
      CREATE TABLE IF NOT EXISTS stocks (
        stock_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        symbol VARCHAR(10) UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS watchlist (
        watchlist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(user_id),
        stock_id UUID REFERENCES stocks(stock_id),
        UNIQUE(user_id, stock_id)
      );
    `;
    console.log('Tables initialized successfully');
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
}
