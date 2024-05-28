import { Check } from "lib/definitions";
import { deleteCheck } from "lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const id = params.id;

  const result = await deleteCheck(id);
  if (result == null) {
    return new Response("Failed to delete check", {
      status: 500,
    });
  }

  return new Response("Check deleted successfully", {
    status: 200,
  });
}
