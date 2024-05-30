import {
  Usuario,
  InformacionMedica,
  InformacionPersonal,
  DocumentosPersonales,
} from "@/lib/definitions";
import { addUser, uploadObject } from "@/lib/db";
import { nanoid } from "nanoid";

const uploadFile = async (file: File) => {
  // If no file is provided, return an empty string
  if (!file) return "";
  const url = `[${nanoid(10)}]${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadObject(url, buffer);
  if (!result) {
    return "";
  }

  return url;
};

export async function POST(req: Request) {
  // The user object is inside the request body
  const data = await req.formData();
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

  const [
    profilePic,
    fileINE,
    fileConstancia,
    fileNSS,
    fileCURP,
    fileComprobante,
  ] = await Promise.all([
    uploadFile(data.get("profilePic") as File),
    uploadFile(data.get("fileINE") as File),
    uploadFile(data.get("fileConstancia") as File),
    uploadFile(data.get("fileAsignacion") as File),
    uploadFile(data.get("fileCURP") as File),
    uploadFile(data.get("comprobanteDomicilio") as File),
  ]);
  let DocumentosPersonales: DocumentosPersonales = {
    INE: fileINE,
    ConstanciaDeSituacionFiscal: fileConstancia,
    AsignacionDeNSS: fileNSS,
    CURP: fileCURP,
    ComprobanteDeDomicilio: fileComprobante,
  };

  let user: Usuario = {
    Nombre: data.get("nombre")?.toString() || "",
    Apellidos: data.get("apellidos")?.toString() || "",
    id: "PER-" + nanoid(10),
    Password: data.get("password")?.toString() || "",
    InformacionMedica: userMeidcal,
    InformacionPersonal: userPersonal,
    DocumentosPersonales: DocumentosPersonales,
    checks: [],
    Foto: profilePic,
  };

  const result = await addUser(user);
  if (!result) {
    return new Response("Failed to create user", {
      status: 500,
    });
  }

  return new Response("Created user successfully!", {
    status: 201,
  });
}
