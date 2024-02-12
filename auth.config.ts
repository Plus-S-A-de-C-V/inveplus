import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  callbacks: {
    //nextUrl
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      console.log("Auth: ", auth, "( ", isLoggedIn, ")");
      if (!isLoggedIn) {
        return false;
      }

      return Response.redirect(new URL("/", nextUrl));
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
