import { Supplier } from "@/lib/definitions";
import { deleteSupplier } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  // get the supplier id from the request, as a string
  // const body = await req.json();
  const id = params.id;

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
