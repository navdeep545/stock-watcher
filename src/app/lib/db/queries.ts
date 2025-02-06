import { sql } from '@vercel/postgres';

export async function getUserWatchlist(email: string) {
  try {
    const result = await sql`
      SELECT w.watchlist_id, s.stock_id, s.symbol
      FROM watchlist w
      JOIN users u ON w.user_id = u.user_id
      JOIN stocks s ON w.stock_id = s.stock_id
      WHERE u.email = ${email}
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw error;
  }
}

export async function addToWatchlist(email: string, symbol: string) {
  try {
    await sql`BEGIN`;

    const userResult = await sql`
      INSERT INTO users (email)
      VALUES (${email})
      ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
      RETURNING user_id
    `;
    const userId = userResult.rows[0].user_id;

    const stockResult = await sql`
      INSERT INTO stocks (symbol)
      VALUES (${symbol.toUpperCase()})
      ON CONFLICT (symbol) DO UPDATE SET symbol = EXCLUDED.symbol
      RETURNING stock_id
    `;
    const stockId = stockResult.rows[0].stock_id;

    const watchlistResult = await sql`
      INSERT INTO watchlist (user_id, stock_id)
      VALUES (${userId}, ${stockId})
      ON CONFLICT (user_id, stock_id) DO NOTHING
      RETURNING watchlist_id
    `;

    await sql`COMMIT`;
    return watchlistResult.rows[0];
  } catch (error) {
    await sql`ROLLBACK`;
    console.error('Error adding to watchlist:', error);
    throw error;
  }
}

export async function removeFromWatchlist(email: string, stockId: string) {
  try {
    const result = await sql`
      DELETE FROM watchlist w
      USING users u
      WHERE w.user_id = u.user_id
      AND u.email = ${email}
      AND w.stock_id = ${stockId}
    `;
    return (result?.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
}