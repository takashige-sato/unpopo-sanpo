export type Status = "pending" | "approved" | "rejected";

export interface Org {
  id: string;
  name: string;
  rep_name: string;
  email: string;
  phone: string;
  area: string;
  website: string;
  dog_count: number;
  description: string;
  status: Status;
  created_at: string;
}

export interface Walker {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  age_group: string;
  motivation: string;
  status: Status;
  created_at: string;
}

export type PaymentStatus = "paid" | "refunded";

export interface Payment {
  id: string;
  walker_id: string | null;
  walker_name: string;
  org_id: string | null;
  org_name: string;
  amount: number;
  system_fee: number;
  donation: number;
  status: PaymentStatus;
  note: string;
  created_at: string;
}

export type PayoutStatus = "pending" | "paid";

export interface Payout {
  id: string;
  org_id: string | null;
  org_name: string;
  amount: number;
  period: string;
  status: PayoutStatus;
  note: string;
  created_at: string;
}

export interface NewOrg {
  name: string;
  rep_name: string;
  email: string;
  phone: string;
  area: string;
  website?: string;
  dog_count?: number;
  description: string;
}

export interface NewWalker {
  name: string;
  email: string;
  phone: string;
  area: string;
  age_group: string;
  motivation: string;
}
