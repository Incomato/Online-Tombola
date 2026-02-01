
export interface User {
  id: string;
  name: string;
  password?: string;
  balance: number;
}

export interface Prize {
  id: string;
  name: string;
  description: string;
  image: string;
  ticketPrice: number;
  winner: User | null;
  maxTickets: number;
}

export interface Ticket {
  id: string;
  prizeId: string;
  ownerId: string;
  ownerName: string;
}

export type AuthError = {
  name?: string;
  password?: string;
  form?: string;
};
