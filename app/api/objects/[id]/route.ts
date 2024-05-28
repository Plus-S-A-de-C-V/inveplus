import { getObject } from "@/lib/db";
import { stringify } from "flatted";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const obj = await getObject(id);

  if (!obj) {
    return new Response("Object not found", {
      status: 404,
    });
  }

  // The filename is in the id: [<10chars>]<filename with extension>
  // Remove the first 12 characters to get the filename
  const filenameWithExtension = id.slice(12);
  //   const extension = filenameWithExtension.split(".")[1];

  //   console.log("Filename: ", filenameWithExtension + "." + extension);

  //   console.log("Object found: ", obj);
  //   const blob = new Blob([stringify(obj)], {
  //     type: "application/json",
  //   });
  //   //   const res = stringify(obj);
  //   //   console.log("Object found: ", res);
  //   return new Response(blob, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Accept-Ranges": "bytes",
  //     },
  //   });

  // The object is a buffer, send it as is
  return new Response(obj, {
    headers: {
      "Content-Disposition": "attachment; filename=" + filenameWithExtension,
      "Content-Type": "application/octet-stream",
      "Accept-Ranges": "bytes",
    },
  });
}
