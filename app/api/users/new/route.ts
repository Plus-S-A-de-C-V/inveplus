import { Usuario } from "@/lib/definitions";
import { addUser } from "@/lib/db";

export async function POST(req: Request) {
  // The user object is inside the request body
  const formData = req.body;
  console.log("formData: ", formData);

  return new Response("Created user successfully!", {
    status: 201,
  });
}
