import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { addToWatchlist, removeFromWatchlist, getUserWatchlist } from '@/app/lib/db/queries';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const watchlist = await getUserWatchlist(session.user.email);
    return NextResponse.json(watchlist);
  } catch (error) {
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
    const result = await addToWatchlist(session.user.email, symbol);
    return NextResponse.json(result);
  } catch (error) {
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
    const success = await removeFromWatchlist(session.user.email, stockId);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove stock' }, { status: 500 });
  }
}