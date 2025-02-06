import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import Header from './components/Header';
import './globals.css';
import AuthProvider from './providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Stock Watchlist',
  description: 'Track your favorite stocks in one place',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}