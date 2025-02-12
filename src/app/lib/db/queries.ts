import { WatchlistItem } from '../types';
import { getDbClient,closeDbClient } from './db';
/**
 * Fetch a user's watchlist based on their email.
*/
export async function getUserWatchlist(email: string): Promise<WatchlistItem[]> {
  const client = await getDbClient();

  try {
    console.log("🔍 Fetching watchlist for user:", email);
    const result = await client.sql<WatchlistItem>`
      SELECT w.watchlist_id, w.user_id, w.stock_id, s.symbol
      FROM watchlist w
      JOIN users u ON w.user_id = u.user_id
      JOIN stocks s ON w.stock_id = s.stock_id
      WHERE u.email = ${email}
    `;

    console.log("✅ Watchlist response:", result.rows);
    return result.rows ?? []; // Ensure an empty array is returned if no data
  } catch (error) {
    console.error("❌ Error fetching watchlist:", error);
    return []; // Return empty array on error
  }
  finally {
    client.release();
  }
}

/**
 * Add a stock to the user's watchlist.
 * If the user or stock does not exist, it ensures they are created.
 */
export async function addToWatchlist(email: string, symbol: string): Promise<WatchlistItem | null> {
  const client = await getDbClient();
  try {
    // Get user_id from email
    const userResult = await client.sql`
      SELECT user_id FROM users WHERE email = ${email}
    `;

    if (!userResult.rows[0]) {
      throw new Error(`User with email ${email} not found`);
    }
    const userId = userResult.rows[0].user_id;

    // Ensure stock exists (Insert if not found)
    const stockResult = await client.sql`
      INSERT INTO stocks (symbol)
      VALUES (${symbol.toUpperCase()})
      ON CONFLICT (symbol) DO UPDATE SET symbol = EXCLUDED.symbol
      RETURNING stock_id, symbol
    `;
    const stockId = stockResult.rows[0].stock_id;
    const stockSymbol = stockResult.rows[0].symbol; // Store symbol from DB

    // Insert into watchlist (Prevent duplicates)
    const watchlistResult = await client.sql`
      INSERT INTO watchlist (user_id, stock_id)
      VALUES (${userId}, ${stockId})
      ON CONFLICT (user_id, stock_id) DO NOTHING
      RETURNING watchlist_id, user_id, stock_id
    `;

    if (!watchlistResult.rows[0]) {
      console.warn(`⚠️ Stock (${symbol}) already in watchlist for user (${email})`);
      return null; // Already exists, return null
    }

    // Return the full WatchlistItem object
    return {
      watchlist_id: watchlistResult.rows[0].watchlist_id,
      user_id: watchlistResult.rows[0].user_id,
      stock_id: watchlistResult.rows[0].stock_id,
      symbol: stockSymbol
    };
  } catch (error) {
    console.error('❌ Error adding to watchlist:', error);
    throw error;
  }
  finally {
    closeDbClient(client);
  }
}


/**
 * Remove a stock from the user's watchlist.
 */
export async function removeFromWatchlist(email: string, stockId: string): Promise<boolean> {
  const client = await getDbClient();
  try {
    const result = await client.sql`
      DELETE FROM watchlist w
      USING users u
      WHERE w.user_id = u.user_id
      AND u.email = ${email}
      AND w.stock_id = ${stockId}
      RETURNING watchlist_id
    `;

    return (result?.rowCount ?? 0) > 0; // Returns true if at least one row was deleted
  } catch (error) {
    console.error('❌ Error removing from watchlist:', error);
    throw error;
  } finally {
    closeDbClient(client);
  }
}
