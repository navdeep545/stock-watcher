import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { users, stocks, watchlist } from '../lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (user_id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (user_id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedStocks() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS stocks (
      stock_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      symbol VARCHAR(10) UNIQUE NOT NULL
    );
  `;

  const insertedStocks = await Promise.all(
    stocks.map(
      (stock) => client.sql`
        INSERT INTO stocks (stock_id, symbol)
        VALUES (${stock.id}, ${stock.symbol})
        ON CONFLICT (stock_id) DO NOTHING;
      `,
    ),
  );

  return insertedStocks;
}

async function seedWatchlist() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS watchlist (
      watchlist_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
      stock_id UUID REFERENCES stocks(stock_id) ON DELETE CASCADE,
      UNIQUE(user_id, stock_id)
    );
  `;

  const insertedWatchlist = await Promise.all(
    watchlist.map(
      (item) => client.sql`
        INSERT INTO watchlist (watchlist_id, user_id, stock_id)
        VALUES (${item.id}, ${item.user_id}, ${item.stock_id})
        ON CONFLICT (watchlist_id) DO NOTHING;
      `,
    ),
  );

  return insertedWatchlist;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedStocks();
    await seedWatchlist();
    await client.sql`COMMIT`;

    return Response.json({ message: '✅ Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}
