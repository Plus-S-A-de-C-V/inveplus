import { Check } from "lib/definitions";
import { addCheck, getUserChecks } from "lib/db";
import { nanoid } from "nanoid";

export async function POST(req: Request): Promise<Response> {
  const FechaYHora = new Date();
  const formData = await req.formData();
  const id = "CHK-" + nanoid(10);

  formData.set("id", id);

  const userChecked = formData.get("userChecked") as string;

  let movimiento = 0;
  const userChecks = await getUserChecks(userChecked);

  // Go to the last check
  const lastCheck = userChecks[userChecks.length - 1];

  if (lastCheck != null) {
    //0 = Entrada, 1 = Salida
    if (lastCheck.movimiento == 0) {
      movimiento = 1;
    } else {
      movimiento = 0;
    }
  }

  const check: Check = {
    id: formData.get("id") as string,
    userChecked: userChecked,
    FechaYHora: FechaYHora,
    movimiento: movimiento,
  };

  const result = await addCheck(check);
  if (result == null) {
    return new Response("Failed to add check", {
      status: 500,
    });
  }

  return new Response("Check added successfully", {
    status: 200,
  });
}
