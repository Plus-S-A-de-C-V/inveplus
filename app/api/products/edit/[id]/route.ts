import { updateProduct } from "@/lib/db";
import { Product } from "@/lib/definitions";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const data = await req.formData();
  const id = params.id;

  const product: Product = {
    Location: data.get("Location")?.toString() || "",
    ProductID: id || "",
    ProductName: data.get("ProductName")?.toString() || "",
    SupplierID: data.get("SupplierID")?.toString() || "",
    QuantityInStock: parseInt(data.get("QuantityInStock")?.toString() || "0"),
    ReorderLevel: parseInt(data.get("ReorderLevel")?.toString() || "0"),
    UnitPrice: parseFloat(data.get("UnitPrice")?.toString() || "0"),
  };

  console.log(data);
  console.log(product);

  const result = await updateProduct(product);
  if (result == null) {
    return new Response("Error adding product", {
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
