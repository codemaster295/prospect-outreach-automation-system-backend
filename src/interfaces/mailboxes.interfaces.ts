export interface Mailbox {
    id?: string; 
    senderEmail: string;
    owner: string;
    provider: 'google' | 'microsoft' | 'smtp'; // Enum values
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
  }