export interface User {
  id: string;
  name: string;
  emal: string;
  emailVerified?: Date | null;
  password: string;
  role: string;
  image?: string | null;
}
