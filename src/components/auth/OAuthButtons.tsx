"use client";

import { createClient } from '@/lib/supabase-client';
import { useState } from 'react';

type Provider = 'google' | 'github';

interface OAuthButtonsProps {
  redirectTo?: string;
}

export function OAuthButtons({ redirectTo = '/dashboard' }: OAuthButtonsProps) {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState('');

  const handleOAuth = async (provider: Provider) => {
    setLoading(provider);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${redirectTo}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(null);
    }
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    fontSize: 14,
    fontWeight: 600,
    border: '1.5px solid #e5e5e0',
    borderRadius: 10,
    background: 'white',
    color: '#111',
    cursor: loading ? 'not-allowed' : 'pointer' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    opacity: loading ? 0.7 : 1,
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button
        onClick={() => handleOAuth('google')}
        disabled={loading !== null}
        style={buttonStyle}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.borderColor = '#2A41C9')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e5e0')}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.3-.2-1.8H9v3.4h4.8c-.2 1-.8 1.9-1.7 2.5v2.2h2.7c1.6-1.5 2.5-3.6 2.5-6.3z"/>
          <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.7-2.2c-.8.5-1.8.8-3.3.8-2.5 0-4.6-1.7-5.4-4H.8v2.3C2.3 15.8 5.5 18 9 18z"/>
          <path fill="#FBBC04" d="M3.6 10.7c-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7V4.9H.8C.3 6 0 7.4 0 9s.3 3 .8 4.1l2.8-2.4z"/>
          <path fill="#EA4335" d="M9 3.6c1.4 0 2.7.5 3.6 1.4l2.7-2.7C13.5.9 11.4 0 9 0 5.5 0 2.3 2.2.8 5.4l2.8 2.4c.8-2.3 2.9-4 5.4-4z"/>
        </svg>
        {loading === 'google' ? 'Signing in...' : 'Continue with Google'}
      </button>

      <button
        onClick={() => handleOAuth('github')}
        disabled={loading !== null}
        style={buttonStyle}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.borderColor = '#2A41C9')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e5e0')}
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="#111">
          <path d="M8 0C3.6 0 0 3.6 0 8c0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1.1-2.7-1.1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.3.6.8.6 1.5v2.2c0 .2.1.5.5.4C13.7 14.5 16 11.5 16 8c0-4.4-3.6-8-8-8z"/>
        </svg>
        {loading === 'github' ? 'Signing in...' : 'Continue with GitHub'}
      </button>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 13,
          color: '#dc2626'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
