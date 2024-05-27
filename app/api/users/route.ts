import { getUsers } from "@/lib/db";

export async function GET(req: Request): Promise<Response> {
  console.log("Getting users...");
  const result = await getUsers();
  if (result == null) {
    // return an empty array
    return new Response("[]", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
