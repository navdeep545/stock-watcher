'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{session.user?.email}</span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
    >
      Sign In with GitHub
    </button>
  );
}