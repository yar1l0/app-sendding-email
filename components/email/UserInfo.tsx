'use client';

import React from 'react';
import { User } from '@/types';
import { useAuth } from '@/lib/auth';

interface UserInfoProps {
  user: User;
}

export const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const { logout } = useAuth();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Mail client</h1>
          <p className="text-gray-600">
            User: {user.username} ({user.email})
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Log out
        </button>
      </div>
    </div>
  );
};