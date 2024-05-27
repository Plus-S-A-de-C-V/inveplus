import { getSuppliers } from "@/lib/db";
import { Supplier } from "@/lib/definitions";

export async function GET(req: Request): Promise<Response> {
  console.log("Getting suppliers...");
  const result: Supplier[] | null = await getSuppliers();
  if (result == null) {
    // return an empty array
    return new Response("[]", {
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
