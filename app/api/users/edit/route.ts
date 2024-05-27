import {
  Usuario,
  InformacionMedica,
  InformacionPersonal,
  DocumentosPersonales,
} from "@/lib/definitions";
import { editObject, updateUser } from "@/lib/db";
import { nanoid } from "nanoid";

export async function PUT(req: Request) {
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

  const profilePic = `[${_profilePic.name}]${nanoid()}`;
  const fileINE = `[${_fileINE.name}]${nanoid()}`;
  const fileConstancia = `[${_fileConstancia.name}]${nanoid()}`;
  const fileNSS = `[${_fileNSS.name}]${nanoid()}`;
  const fileCURP = `[${_fileCURP.name}]${nanoid()}`;
  const fileComprobante = `[${_fileComprobante.name}]${nanoid()}`;

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
    editObject(profilePic, profilePicBuffer),
    editObject(fileINE, fileINEBuffer),
    editObject(fileConstancia, fileConstanciaBuffer),
    editObject(fileNSS, fileNSSBuffer),
    editObject(fileCURP, fileCURPBuffer),
    editObject(fileComprobante, fileComprobanteBuffer),
  ]);

  let DocumentosPersonales: DocumentosPersonales = {
    INE: profilePic,
    ConstanciaDeSituacionFiscal: fileConstancia,
    AsignacionDeNSS: fileNSS,
    ComprobanteDeDomicilio: fileComprobante,
    CURP: fileCURP,
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

  console.log(user);

  const result = await updateUser(user);
  if (!result) {
    return new Response("Failed to create user", {
      status: 500,
    });
  }

  return new Response("Created user successfully!", {
    status: 201,
  });
}
