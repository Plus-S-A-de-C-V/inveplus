import { NextRequest, NextResponse } from "next/server";
import database, { FoldersNames } from "@/lib/db";

export async function POST(_req: NextRequest) {
  const req = _req;
  const json = await req.json();
  const nuevaPersona = json.nuevaPersona;
  console.log("Received request: ", nuevaPersona);

  if(!nuevaPersona.isSystemUser){
    nuevaPersona.password = null;
  }

  // Replace emprty strings with null
  Object.keys(nuevaPersona).forEach((key) => {
    if (nuevaPersona[key] === "") {
      nuevaPersona[key] = null;
    }
  })

  try {
    database.nuevoUsuario(
      nuevaPersona.profilePictureUrl,
      nuevaPersona.nombre,
      nuevaPersona.apellidos,
      nuevaPersona.hashedPassword,
      nuevaPersona.fechaDeNacimiento,
      nuevaPersona.curp,
      nuevaPersona.rfc,
      nuevaPersona.nss,
      nuevaPersona.claveLector,
      nuevaPersona.direccion,
      nuevaPersona.numeroTelefonico,
      nuevaPersona.email,
      nuevaPersona.clinica,
      nuevaPersona.tipoSangre,
      nuevaPersona.fileINEUrl,
      nuevaPersona.fileConstanciaUrl,
      nuevaPersona.fileAsignacionUrl,
      nuevaPersona.fileCURPUrl,
    );
  } catch (error) {
    // TODO: Handle errors
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
