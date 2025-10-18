import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ profile, account }) {
      // 1. 구글 프로필 검증
      // TODO: 프론트에서 “Google 프로필 정보가 올바르지 않습니다” 표시
      if (!profile?.email || !profile?.name) {
        console.error("Invalid Google profile:", profile);
        throw new Error(
          "Google profile missing required fields (email or name).",
        );
      }

      // 2. 이메일 도메인 제약 등을 걸 수도 있음
      // if (!profile.email.endsWith("@gmail.com")) {
      //   throw new Error("Only Gmail accounts are allowed");
      // }

      return true; // 통과 시 로그인 진행
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
