import {
  Usuario,
  InformacionMedica,
  InformacionPersonal,
  DocumentosPersonales,
} from "@/lib/definitions";
import { editObject, updateUser, deleteObject, getUser } from "@/lib/db";
import { nanoid } from "nanoid";

async function updateFiles(file: File) {
  console.log("Updating file", file);
  // If no file is provided, return ann empty string
  if (!file) return "";
  const url = `[${nanoid(10)}]${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const result = await editObject(url, buffer);
    if (!result) {
      return "";
    }
  } catch (e) {
    console.error("Failed to update file", e);
    return "";
  }

  return url;
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const data = await req.formData();
  const oldUser = await getUser(id);
  if (!oldUser) {
    return new Response("User not found", {
      status: 404,
    });
  }

  // Delete old files
  const oldProfilePic = oldUser.DocumentosPersonales?.INE;
  const oldFileINE = oldUser.DocumentosPersonales?.ConstanciaDeSituacionFiscal;
  const oldFileConstancia = oldUser.DocumentosPersonales?.AsignacionDeNSS;
  const oldFileNSS = oldUser.DocumentosPersonales?.ComprobanteDeDomicilio;
  const oldFileCURP = oldUser.DocumentosPersonales?.CURP;

  const filesToDelete = [
    oldProfilePic,
    oldFileINE,
    oldFileConstancia,
    oldFileNSS,
    oldFileCURP,
  ];

  Promise.all(
    filesToDelete.map((file) =>
      deleteObject(file || "").catch((error) => {
        console.error(`Failed to delete file: ${file}. Error: ${error}`);
      })
    )
  );

  console.log("Files deleted");

  // The user object is inside the request body

  const userMeidcal: InformacionMedica = {
    ClinicaAsignada: data.get("clinica")?.toString() || "",
    TipoDeSangre: data.get("tipoSangre")?.toString() || "",
  };

  const userPersonal: InformacionPersonal = {
    ClaveLector: data.get("claveLector")?.toString() || "",
    CURP: data.get("curp")?.toString() || "",
    Direccion: data.get("direccion")?.toString() || "",
    FechaDeNacimiento: new Date(
      data.get("fechaDeNacimiento")?.toString() || ""
    ),
    correoElectronico: data.get("email")?.toString() || "",
    NSS: data.get("nss")?.toString() || "",
    NumeroTelefonico: data.get("numeroTelefonico")?.toString() || "",
    RFC: data.get("rfc")?.toString() || "",
  };

  console.log("Updating files");

  const [
    profilePic,
    fileINE,
    fileConstancia,
    fileNSS,
    fileCURP,
    fileComprobante,
  ] = await Promise.all([
    updateFiles(data.get("profilePic") as File),
    updateFiles(data.get("fileINE") as File),
    updateFiles(data.get("fileConstancia") as File),
    updateFiles(data.get("fileAsignacion") as File),
    updateFiles(data.get("fileCURP") as File),
    updateFiles(data.get("comprobanteDomicilio") as File),
  ]);

  let DocumentosPersonales: DocumentosPersonales = {
    INE: fileINE,
    ConstanciaDeSituacionFiscal: fileConstancia,
    AsignacionDeNSS: fileNSS,
    ComprobanteDeDomicilio: fileComprobante,
    CURP: fileCURP,
  };

  let user: Usuario = {
    Nombre: data.get("nombre")?.toString() || "",
    Apellidos: data.get("apellidos")?.toString() || "",
    id: params.id,
    Password: data.get("password")?.toString() || "",
    InformacionMedica: userMeidcal,
    InformacionPersonal: userPersonal,
    DocumentosPersonales: DocumentosPersonales,
    checks: [],
    Foto: profilePic,
  };

  // console.log("Old user", oldUser);
  // console.log("New user", user);

  console.log("Trying to update user");
  try {
    console.log("Updating user");
    const result = await updateUser(user);
    if (!result) {
      return new Response("Failed to create user", {
        status: 500,
      });
    }

    console.log("User updated successfully");
    return new Response("Created user successfully!", {
      status: 201,
    });
  } catch (e) {
    console.error("Failed to update user", e);
    return new Response("Failed to update user", {
      status: 500,
    });
  }
}
