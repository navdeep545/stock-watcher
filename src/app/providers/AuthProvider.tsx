'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({
  children,
  session,
}: {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  children: React.ReactNode;
  session: any;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}