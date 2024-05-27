import { getProducts } from "@/lib/db";
import { Product } from "@/lib/definitions";

export async function GET(req: Request): Promise<Response> {
  console.log("Getting products...");
  const result: Product[] | null = await getProducts();
  if (result == null) {
    // return an empty array
    return new Response(JSON.stringify(result), {
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
