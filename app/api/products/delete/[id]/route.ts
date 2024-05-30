import { deleteProduct } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const id = params.id;

  const result = await deleteProduct(id);
  if (result == null) {
    return new Response("Error deleting product", {
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
