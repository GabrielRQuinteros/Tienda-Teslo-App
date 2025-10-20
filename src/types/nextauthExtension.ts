import { DefaultUser } from "next-auth";

// 🔹 Extendemos el User de NextAuth
interface IUser extends DefaultUser {
  roles?: string[];
  isActive?: boolean;
  // puedes agregar más campos que tengas en tu modelo User
}

declare module "next-auth" {

  interface Session {
    user: IUser & {
      id: string; //
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {
    id?: string;
  }
}
