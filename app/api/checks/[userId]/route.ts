import { Check } from "lib/definitions";
import { getUserChecks } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
): Promise<Response> {
  const userId = params.userId;

  const userChecks = await getUserChecks(userId);
  if (userChecks == null) {
    // return an empty array
    return new Response("[]", {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }

  return new Response(JSON.stringify(userChecks), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
