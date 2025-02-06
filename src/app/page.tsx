import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to Stock Watchlist
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Track your favorite stocks in one place. Sign in to get started.
        </p>
        <Link
          href="/api/auth/signin"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}