import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";

import { Usuario } from "@/lib/definitions";
import { ZodError } from "zod";
import { signInSchema } from "@/lib/zod";

const providers: Provider[] = [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Credenciales",
    credentials: {
      // id: { label: "ID", type: "text", placeholder: "PER-XXXXXXXX" },
      // password: { label: "Contraseña", type: "password" },
      id: {},
      password: {},
    },

    async authorize(credentials, request) {
      // TODO: Implementar autenticación
      try {
        const { id, password } = await signInSchema.parseAsync(credentials);
        console.log("credentials: ", credentials.id, credentials.password);

        const user: Usuario = {
          id: id,
          Nombre: "Pepe",
          Apellidos: "Perez",
          Foto: "https://via.placeholder.com/150",
          Password: password,
        };

        if (user) {
          return user;
        } else {
          return null;
        }
      } catch (error) {
        if (error instanceof ZodError) {
          return null;
        } else {
          return null;
        }
      }
    },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    // signingKey: process.env.NEXTAUTH_SECRET,
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
});
