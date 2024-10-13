import { NextAuthOptions } from "next-auth";
import  CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dibConnect";
import UserModel from "@/model/User";



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        Email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<null> {
        console.log("authorize", credentials);
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.Email },
              { username: credentials.Email },
            ],
          });

          if (!user) {
            console.log("User not found");
            throw new Error("User not found");
          }

          if (!user.isVrified) {
            console.log("User not verified");
            throw new Error("User not verified");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("isPasswordCorrect", isPasswordCorrect);

          if (isPasswordCorrect) {
            console.log("Returning user");
            return user;
          } else {
            console.log("Incorrect password");
            throw new Error("Incorrect password");
          }
        } catch (err: unknown) {
          console.log("authorize error", err);
          throw new Error(err.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
