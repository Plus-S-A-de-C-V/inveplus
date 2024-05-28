import { addSupplier } from "@/lib/db";
import { Supplier } from "@/lib/definitions";
import { nanoid } from "nanoid";

export async function POST(req: Request): Promise<Response> {
  const data = await req.formData();

  // Set the SupplierID to a new unique identifier
  data.set("SupplierID", `SUP-${nanoid(10)}`);

  const supplier: Supplier = {
    SupplierID: data.get("SupplierID")?.toString() || "",
    SupplierName: data.get("SupplierName")?.toString() || "",
    ContactName: data.get("ContactName")?.toString() || "",
    Address: data.get("Address")?.toString() || "",
    City: data.get("City")?.toString() || "",
    PostalCode: data.get("PostalCode")?.toString() || "",
    Country: data.get("Country")?.toString() || "",
    Phone: data.get("Phone")?.toString() || "",
    Mail: data.get("Mail")?.toString() || "",
  };

  console.log(supplier);

  const result = await addSupplier(supplier);
  if (result == null) {
    return new Response("Error adding supplier", {
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
