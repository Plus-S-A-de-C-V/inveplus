import { Usuario } from "@/lib/definitions";
import { addUser } from "@/lib/db";

export async function POST(req: Request) {
  // The user object is inside the request body
  const user: Usuario = await req.json();

  // Save the user to the database
}
