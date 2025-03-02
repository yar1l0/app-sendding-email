export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Email {
  id: number;
  sender: number;
  recipient: string;
  subject: string;
  body: string;
  created_at: string;
}

export interface PaginationData {
  count: number;
  next: string | null;
  previous: string | null;
  results: Email[];
}

export interface IDEmail {
  id: number;
  sender: number;
  recipient: string;
  subject: string;
  message: string;
}