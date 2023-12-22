import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import CredentialsProvider from "next-auth/providers/credentials";

import { z } from "zod";
import { Usuario } from "@/lib/definitions";

async function getUser(email: string): Promise<Usuario | null> {
  // TODO: Implementar la consulta a la base de datos

  // Temp solution
  const Usuario: Usuario = {
    id: "1",
    // name: "John",
    // email: email,
    // image: "https://i.pravatar.cc/300",
    // password: "1234",
    Apellidos: "Doe",
    Nombre: "John",
    Foto: "https://via.placeholder.com/150",
    Password: "1234",
  };

  throw new Error("Not implemented");

  return Usuario;
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      id: "credentials",
      // Nombre a presentar
      name: "Credenciales",

      credentials: {
        email: { label: "ID", type: "text", placeholder: "PER-XXXXXXXX" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials);

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) {
            return null;
          }

          const passwordMatch = user.Password === password;
          if (passwordMatch) {
            return user;
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
