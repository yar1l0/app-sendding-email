import { User, Email, IDEmail, PaginationData } from '@/types';

const BASE_URL = 'http://68.183.74.14:4005/api';

export const getAuthHeader = (): string => {
  if (typeof window !== 'undefined') {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    return 'Basic ' + btoa(`${username}:${password}`);
  }
  return '';
};

export const api = {
  // Auth
  login: async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users/current/`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${username}:${password}`), 
      },
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve user data');
    }

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    return await response.json();
  },

  // register
  register: async (username: string, email: string, password: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration error');
    }
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    await response.json();
  },

  // User
  getCurrentUser: async (): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users/current/`, {
      headers: {
        'Authorization': getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve user data');
    }

    return await response.json();
  },

  // Emails
  getEmails: async (page: number = 1, limit: number = 5): Promise<PaginationData> => {
    const offset = (page - 1) * limit;
    const response = await fetch(`${BASE_URL}/emails/?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get list of letters');
    }

    return await response.json();
  },


  sendEmail: async (data: { sender: number; recipient: string; subject: string; message: string }): Promise<Email> => {
    const response = await fetch(`${BASE_URL}/emails/`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error sending email');
    }

    return await response.json();
  },

  IDEmail: async (id: number): Promise<IDEmail> => {
    const response = await fetch(`${BASE_URL}/emails/${id}/`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${localStorage.getItem('username')}:${localStorage.getItem('password')}`),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to load email');
    }

    return await response.json();
  },

};