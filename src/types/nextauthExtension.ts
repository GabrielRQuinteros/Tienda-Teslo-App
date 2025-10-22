import { DefaultSession, DefaultUser } from "next-auth";

// 🔹 Extendemos el User de NextAuth
interface IUser extends DefaultUser {
  id: string;
  roles?: string[];
  isActive?: boolean;
}

declare module "next-auth" {
  interface Session {
    user: IUser;
  }

  // 🔹 Aquí defines las propiedades adicionales para User
  interface User {
    id: string;
    roles?: string[];
    isActive?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles?: string[];
    isActive?: boolean;
  }
}