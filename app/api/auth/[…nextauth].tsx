import CredentialsProvider from "next-auth/providers/credentials";
import { Usuario } from "@/lib/definitions";

import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Nombre a presentar
      name: "Credenciales",

      credentials: {
        email: { label: "ID", type: "text", placeholder: "PER-XXXXXXXX" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, request) {
        // TODO: Implementar autenticación

        const user: Usuario = {
          id: "PER-XXXXXXXX",
          Nombre: "Pepe",
          Apellidos: "Perez",
          Foto: "https://via.placeholder.com/150",
          Password: "1234",
        };

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
