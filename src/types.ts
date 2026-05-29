export interface GuestEvent {
  name: string;
  maxInvitees: number;
}

export interface Guest {
  id: number;
  name: string;
  events: GuestEvent[];
  side: 'bride' | 'groom';
}