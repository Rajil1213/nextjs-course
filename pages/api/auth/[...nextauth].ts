import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { find } from "@/services/db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  secret: "a-very-long-secret-for-jwt",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" }
      },
      authorize(credentials) {
        if (!credentials) {
          throw new Error("no credentials provided");
        }

        const user = find("users").find(
          (user: { email: string; password: string }) =>
            user.email === credentials.email && user.password === credentials.password
        );

        if (!user) {
          throw new Error("could not log you in");
        }

        return user;
      }
    })
  ]
};

export default NextAuth(authOptions);
