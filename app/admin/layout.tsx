'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAppStore } from '@/lib/store';
import { supabase, getProfile } from '@/lib/supabaseClient';
import { RefreshCw } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn, setAdminLoggedIn, setActiveAdminProfile } = useAppStore();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        setAdminLoggedIn(false);
        router.push('/admin/login');
      } else {
        setAdminLoggedIn(true);
        const profile = await getProfile(session.user.id);
        if (profile) {
          setActiveAdminProfile(profile);
        } else {
          setActiveAdminProfile({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Administrador',
            role: 'admin',
            subscription_plan: session.user.user_metadata?.subscription_plan || 'gratis',
            live_stream_url: '',
          });
        }
      }
      setCheckingAuth(false);
    });
  }, [router, setAdminLoggedIn, setActiveAdminProfile]);

  if (checkingAuth) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center space-y-3 text-cyan-400 font-mono text-sm">
        <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
        <span>Verificando sesión administradora en Supabase...</span>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] pb-20 md:pb-0">
      <AdminSidebar />
      {children}
    </div>
  );
}
