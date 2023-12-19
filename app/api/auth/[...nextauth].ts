import CredentialsProvider from "next-auth/providers/credentials";

providers: [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: "Credenciales",

    credentials: {
      username: { label: "id", type: "text", placeholder: "PER-XXXXXXXX" },
      password: { label: "Password", type: "password" },
    },

    async authorize(credentials) {
      const res = await fetch("api/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const user = await res.json();

      if (res.ok && user) {
        return user;
      }

      return null;
    },
  }),
];
