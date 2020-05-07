export interface AuthUserObject {
  id: number;
  avatar: string;
  name: string;
  email: string;
  provider: string
  provider_id: string
  updated_at: Date;
  created_at: Date;
}
