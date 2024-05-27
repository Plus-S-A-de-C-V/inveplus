import { init } from "@/lib/db";

export async function GET() {
  const r = init();

  return Response.json(r);
}
