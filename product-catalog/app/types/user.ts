export interface User {
  id: number;
  email: string;
  password: string;
  status: "ACTIVE" | "LOCKED" | "DISABLED";
}