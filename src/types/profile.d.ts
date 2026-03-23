export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  address?: string;
  location?: string;
  village?: string;
  city?: string;
  state?: string;
  pin?: string;
  landmark?: string;
  scheme?: string;
  isAccept: boolean;
  created_at?: Date;
  updated_at?: Date;
}
