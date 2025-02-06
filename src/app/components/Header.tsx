import Link from 'next/link';
import AuthButton from './AuthButton';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Stock Watchlist
          </Link>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}