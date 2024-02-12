import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Usuario } from "@/lib/definitions";

export const authOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credenciales",
      credentials: {
        id: { label: "ID", type: "text", placeholder: "PER-XXXXXXXX" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, request) {
        // TODO: Implementar autenticación

        const user: Usuario = {
          id: credentials?.id as string,
          Nombre: "Pepe",
          Apellidos: "Perez",
          Foto: "https://via.placeholder.com/150",
          Password: credentials?.password as string,
        };

        if (user) {
          console.log("Logged in as the user: ", user);
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    signingKey: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      // TODO: Implementar autenticación
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async redirect({ url, baseUrl }: any) {
      return baseUrl;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
