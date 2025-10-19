import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
    };
  }
  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    picture?: string | null;
  }
}
