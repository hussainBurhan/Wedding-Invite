export interface GuestEvent {
  name: string;
  maxInvitees: number | 'all';
  ladies: number;
  gents: number;
}

export interface Guest {
  id: number;
  name: string;
  events: GuestEvent[];
  side: 'bride' | 'groom';
}
