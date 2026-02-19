export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
}

export interface CreateContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}