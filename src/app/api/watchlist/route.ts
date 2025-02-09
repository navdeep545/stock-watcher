import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { addToWatchlist, removeFromWatchlist, getUserWatchlist } from '@/app/lib/db/queries';
import { WatchlistItem } from '@/app/lib/types';

export async function GET() {

  console.log("📡 Fetching watchlist...");
  const session = await getServerSession();
  if (!session?.user?.email) {
    console.log("❌ Unauthorized - No session or email found");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // console.log("🔍 Fetching watchlist for user:", session.user.email);
    const watchlist: WatchlistItem[] = await getUserWatchlist(session.user.email);
    console.log("✅ Watchlist response:", watchlist);
    return NextResponse.json(watchlist);
  } catch (error) {
    console.error('❌ Error fetching watchlist:', error);
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { symbol } = await request.json();
    if (!symbol) {
      return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
    }

    const newWatchlistItem: WatchlistItem | null = await addToWatchlist(session.user.email, symbol);
    if (!newWatchlistItem) {
      return NextResponse.json({ error: 'Failed to add stock' }, { status: 500 });
    }

    return NextResponse.json(newWatchlistItem);
  } catch (error) {
    console.error('❌ Error adding stock:', error);
    return NextResponse.json({ error: 'Failed to add stock' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { stockId } = await request.json();
    if (!stockId) {
      return NextResponse.json({ error: 'Stock ID is required' }, { status: 400 });
    }

    const success = await removeFromWatchlist(session.user.email, stockId);
    if (!success) {
      return NextResponse.json({ error: 'Failed to remove stock' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error removing stock:', error);
    return NextResponse.json({ error: 'Failed to remove stock' }, { status: 500 });
  }
}
