import {
  Usuario,
  InformacionMedica,
  InformacionPersonal,
  DocumentosPersonales,
} from "@/lib/definitions";
import { deleteUser } from "@/lib/db";

export async function DELETE(req: Request) {
  // get the user id from the request
  const body = await req.json();
  const id = body.id;
  const user = await deleteUser(id);
  if (!user) {
    return new Response("User not found", {
      status: 404,
    });
  }

  return new Response("User deleted", {
    status: 200,
  });
}
