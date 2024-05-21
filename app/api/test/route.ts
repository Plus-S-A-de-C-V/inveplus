import { getUser } from "@/lib/db";
import { Usuario } from "@/lib/definitions";

export async function GET() {
  const users: Usuario | null = await getUser(" z1");

  return new Response(JSON.stringify(users), {
    status: 200,
    statusText: JSON.stringify(users),
  });

  // Route for testing purposes

  // Return, I'm a teapot
  return new Response("I'm a teapot", {
    status: 418,
    statusText: "I'm a teapot",
  });
}
