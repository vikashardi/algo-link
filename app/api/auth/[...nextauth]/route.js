import bcrypt from "bcryptjs";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        const { email, password } = credentials;
        if (!email || !password) return null;
        try {
          await dbConnect();
          const user = await User.findOne({ email });
          if (!user) return null;
          if (await bcrypt.compare(password, user.password)) return user;

          // No user or err
          return null;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();
      session.user.isAdmin = sessionUser.isAdmin;
      return session;
    },
    async signIn({ user }) {
      return user;
    },
    // async jwt({ token, user, account, profile, isNewUser }) {
    //   console.log("jwt");
    //   console.log(user);
    //   console.log(token);
    //   return { ...user, ...token };
    // },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
