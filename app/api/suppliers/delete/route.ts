import { Supplier } from "@/lib/definitions";
import { deleteSupplier } from "@/lib/db";

export async function POST(req: Request): Promise<Response> {
  // get the supplier id from the request, as a string
  const body = await req.json();
  const id = body.id;

  const result = await deleteSupplier(id);
  if (result == null) {
    return new Response("Error deleting supplier", {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }

  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
