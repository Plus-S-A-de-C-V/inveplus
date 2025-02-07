import { Supplier } from "@/lib/definitions";
import { updateSupplier } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const data = await req.formData();
  const id = params.id;
  const supplier: Supplier = {
    SupplierID: id || "",
    SupplierName: data.get("SupplierName")?.toString() || "",
    ContactName: data.get("ContactName")?.toString() || "",
    Address: data.get("Address")?.toString() || "",
    City: data.get("City")?.toString() || "",
    PostalCode: data.get("PostalCode")?.toString() || "",
    Country: data.get("Country")?.toString() || "",
    Phone: data.get("Phone")?.toString() || "",
    Mail: data.get("Mail")?.toString() || "",
  };

  const result = await updateSupplier(supplier);
  if (result == null) {
    return new Response("Error updating supplier", {
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
    status: 201,
  });
}
