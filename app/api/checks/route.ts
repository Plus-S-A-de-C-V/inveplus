import { Check } from "lib/definitions";
import { getChecks } from "lib/db";

export async function GET(req: Request): Promise<Response> {
  console.log("Getting checks...");
  const result: Check[] | null = await getChecks();
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
