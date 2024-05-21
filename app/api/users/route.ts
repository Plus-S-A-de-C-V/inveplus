import { getUsers } from "@/lib/db";

export async function GET(req: Request): Promise<Response> {
  const result = await getUsers();
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
