
export interface Client {
  id: string;
  user_id: string;
  name: string;
  industry: string | null;
  status: 'Active' | 'At Risk' | 'Inactive';
  revenue: number | null;
  growth: number | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  start_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type NewClient = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
