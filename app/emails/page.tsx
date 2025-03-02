'use client';

import React, { useState, useEffect } from 'react';
import { UserInfo } from '@/components/email/UserInfo';
import { EmailComposer } from '@/components/email/EmailComposer';
import { EmailList } from '@/components/email/EmailList';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { api } from '@/lib/api';
import { User } from '@/types';

export default function EmailsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error retrieving user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEmailSent = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ProtectedLayout>
      <div className="container mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          user && (
            <>
              <UserInfo user={user} />
              <EmailComposer user={user} onEmailSent={handleEmailSent} />
              <EmailList refreshTrigger={refreshTrigger} />
            </>
          )
        )}
      </div>
    </ProtectedLayout>
  );
}