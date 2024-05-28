import {
  Usuario,
  InformacionMedica,
  InformacionPersonal,
  DocumentosPersonales,
} from "@/lib/definitions";
import { addUser, uploadObject } from "@/lib/db";
import { nanoid } from "nanoid";

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

  const __profilePic = data.get("profilePic");
  const __fileINE = data.get("fileINE");
  const __fileConstancia = data.get("fileConstancia");
  const __fileNSS = data.get("fileAsignacion");
  const __fileCURP = data.get("fileCURP");
  const __fileComprobante = data.get("comprobanteDomicilio");

  // If any of the files is missing, return an error
  if (
    !__profilePic ||
    !__fileINE ||
    !__fileConstancia ||
    !__fileNSS ||
    !__fileCURP ||
    !__fileComprobante
  ) {
    console.log("Missing files");
    console.log(__profilePic);
    console.log(__fileINE);
    console.log(__fileConstancia);
    console.log(__fileNSS);
    console.log(__fileCURP);
    console.log(__fileComprobante);
    console.log(data);
    return new Response("Missing files", {
      status: 400,
    });
  }

  const _profilePic = __profilePic as File;
  const _fileINE = __fileINE as File;
  const _fileConstancia = __fileConstancia as File;
  const _fileNSS = __fileNSS as File;
  const _fileCURP = __fileCURP as File;
  const _fileComprobante = __fileComprobante as File;

  const profilePic = `[${nanoid(10)}]${_profilePic.name}`;
  const fileINE = `[${nanoid(10)}]${_fileINE.name}`;
  const fileConstancia = `[${nanoid(10)}]${_fileConstancia.name}`;
  const fileNSS = `[${nanoid(10)}]${_fileNSS.name}`;
  const fileCURP = `[${nanoid(10)}]${_fileCURP.name}`;
  const fileComprobante = `[${nanoid(10)}]${_fileComprobante.name}`;

  const profilePicBuffer = Buffer.from(await _profilePic.arrayBuffer());
  const fileINEBuffer = Buffer.from(await _fileINE.arrayBuffer());
  const fileConstanciaBuffer = Buffer.from(await _fileConstancia.arrayBuffer());
  const fileNSSBuffer = Buffer.from(await _fileNSS.arrayBuffer());
  const fileCURPBuffer = Buffer.from(await _fileCURP.arrayBuffer());
  const fileComprobanteBuffer = Buffer.from(
    await _fileComprobante.arrayBuffer()
  );

  // TODO: Add error handling
  Promise.all([
    uploadObject(profilePic, profilePicBuffer),
    uploadObject(fileINE, fileINEBuffer),
    uploadObject(fileConstancia, fileConstanciaBuffer),
    uploadObject(fileNSS, fileNSSBuffer),
    uploadObject(fileCURP, fileCURPBuffer),
    uploadObject(fileComprobante, fileComprobanteBuffer),
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
