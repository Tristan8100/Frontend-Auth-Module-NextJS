'use client';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    // This effect runs when the component mounts
    console.log(user);
    if (!user) {
      // Redirect to login if user is not authenticated
      router.push('/login');
    }
  }, []);
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav className="space-y-2">
          <a href="/dashboard" className="block hover:underline">Home</a>
          <a href="/dashboard/settings" className="block hover:underline">Settings</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
