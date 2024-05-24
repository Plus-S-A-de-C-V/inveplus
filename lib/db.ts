const account_id = process.env.ACCOUNT_ID;
const database_id = process.env.DATABASE_ID;
const bearer_token = process.env.BEARER_TOKEN;
const BEARER_TOKEN = bearer_token;
const DATABASE_ID = database_id || "";

const S3_API_URL = process.env.S3_API_URL || "";
const S3_API_TOKEN = process.env.S3_API_TOKEN || "";
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || "";
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "";
const ACCOUNT_ID = process.env.ACCOUNT_ID || "";
const ACCOUNT_EMAIL = process.env.ACCOUNT_EMAIL || "";

//import { S3 } from "@aws-sdk/client-s3";
import S3 from "aws-sdk/clients/s3.js";

import { Usuario } from "@/lib/definitions";

import Cloudflare from "cloudflare";

const s3 = new S3({
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: `${S3_ACCESS_KEY}`,
  secretAccessKey: `${S3_SECRET_ACCESS_KEY}`,
  signatureVersion: "v4",
});

const cloudflare = new Cloudflare({
  apiEmail: ACCOUNT_EMAIL,
  apiToken: BEARER_TOKEN,
});

export async function getUsers() {
  const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: "SELECT * FROM Usuario",
  });

  const data = await response[0];

  if (!data.success) {
    console.error("Failed to fetch data: ", data);
    return null;
  }

  const result = data.results;

  let users: Usuario[] = [];

  if (result) {
    users = result.map((user: any) => {
      return {
        id: user.id,
        Nombre: user.Nombre,
        Apellidos: user.Apellidos,
        Foto: user.LINK_Foto,
        Password: user.Password,
        InformacionPersonal: undefined,
        InformacionMedica: undefined,
        DocumentosPersonales: undefined,
        Historial: undefined,
      };
    });
  }

  return users;
}

export async function getUser(id: string) {
  const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `SELECT * FROM Usuario WHERE id = "${id}"`,
  });

  const data = await response[0];

  if (!data.success) {
    console.error("Failed to fetch data: ", data);
    return null;
  }

  const _resultArray = data.results;
  if (!_resultArray) {
    return null;
  }

  const _result = _resultArray[0];

  if (!_result) {
    return null;
  }

  const result = _result;

  const user: Usuario = {
    id: result.id,
    Nombre: result.Nombre,
    Apellidos: result.Apellidos,
    Foto: result.LINK_Foto,
    Password: result.Password,
    InformacionPersonal: undefined,
    InformacionMedica: undefined,
    DocumentosPersonales: undefined,
    Historial: undefined,
  };

  return user;
}

export async function addUser(user: Usuario) {
  // first add the user to the user table

  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `INSERT INTO Usuario (id, Nombre, Apellidos, LINK_Foto, Password) VALUES ("${user.id}", "${user.Nombre}", "${user.Apellidos}", "${user.Foto}", "${user.Password}");`,
  });

  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `INSERT INTO InformacionMedica (UsuarioId, ClinicaAsignada, TipoDeSangre) VALUES ("${user.id}", "${user.InformacionMedica?.ClinicaAsignada}", "${user.InformacionMedica?.TipoDeSangre}");`,
  });

  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `INSERT INTO InformacionPersonal (UsuarioId, FechaDeNacimiento, CURP, RFC, ClaveLector, Direccion, NumeroTelefonico, correoElectronico, LINK_INE, LINK_ConstanciaDeSituacionFiscal, LINK_AsignacionDeNSS, LINK_ComprobanteDeDominio, LINK_CURP) VALUES ("${user.id}", "${user.InformacionPersonal?.FechaDeNacimiento}", "${user.InformacionPersonal?.CURP}", "${user.InformacionPersonal?.RFC}", "${user.InformacionPersonal?.NSS}", "${user.InformacionPersonal?.ClaveLector}", "${user.InformacionPersonal?.Direccion}", "${user.InformacionPersonal?.NumeroTelefonico}", "${user.InformacionPersonal?.correoElectronico}", "${user.DocumentosPersonales?.INE}", "${user.DocumentosPersonales?.ConstanciaDeSituacionFiscal}", "${user.DocumentosPersonales?.AsignacionDeNSS}", "${user.DocumentosPersonales?.CURP}");`,
  });

  return user;
}

export async function updateUser(user: Usuario) {
  // Check if the user exists
  const userToUpdate = await getUser(user.id);
  if (!userToUpdate) {
    console.error("Failed to update user: User not found");
    return null;
  }

  // first update the user in the user table
  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `UPDATE Usuario SET Nombre = "${user.Nombre}", Apellidos = "${user.Apellidos}", LINK_Foto = "${user.Foto}", Password = "${user.Password}" WHERE id = "${user.id}"`,
  });

  // then update the user in the InformacionMedica table
  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `UPDATE InformacionMedica SET ClinicaAsignada = "${user.InformacionMedica?.ClinicaAsignada}", TipoDeSangre = "${user.InformacionMedica?.TipoDeSangre}" WHERE UsuarioId = "${user.id}"`,
  });

  // then update the user in the InformacionPersonal table
  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `UPDATE InformacionPersonal SET FechaDeNacimiento = "${user.InformacionPersonal?.FechaDeNacimiento}", CURP = "${user.InformacionPersonal?.CURP}", RFC = "${user.InformacionPersonal?.RFC}", ClaveLector = "${user.InformacionPersonal?.ClaveLector}", Direccion = "${user.InformacionPersonal?.Direccion}", NumeroTelefonico = "${user.InformacionPersonal?.NumeroTelefonico}", correoElectronico = "${user.InformacionPersonal?.correoElectronico}", LINK_INE = "${user.DocumentosPersonales?.INE}", LINK_ConstanciaDeSituacionFiscal = "${user.DocumentosPersonales?.ConstanciaDeSituacionFiscal}", LINK_AsignacionDeNSS = "${user.DocumentosPersonales?.AsignacionDeNSS}", LINK_ComprobanteDeDominio = "${user.DocumentosPersonales?.ComprobanteDeDomicilio}", LINK_CURP = "${user.DocumentosPersonales?.CURP}" WHERE UsuarioId = "${user.id}"`,
  });

  return user;
}

export async function deleteUser(id: string) {
  // first delete the user in the user table

  const userToDelete = await getUser(id);
  if (!userToDelete) {
    console.error("Failed to delete user: User not found");
    return null;
  }

  deleteObject(userToDelete.Foto);
  if (userToDelete.DocumentosPersonales) {
    deleteObject(userToDelete.DocumentosPersonales.INE);
    deleteObject(userToDelete.DocumentosPersonales.ConstanciaDeSituacionFiscal);
    deleteObject(userToDelete.DocumentosPersonales.AsignacionDeNSS);
    deleteObject(userToDelete.DocumentosPersonales.ComprobanteDeDomicilio);
    deleteObject(userToDelete.DocumentosPersonales.CURP);
  }

  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `DELETE FROM InformacionMedica WHERE UsuarioId = "${id}"`,
  });

  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `DELETE FROM InformacionPersonal WHERE UsuarioId = "${id}"`,
  });

  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `DELETE FROM Usuario WHERE Id = "${id}"`,
  });

  return userToDelete;
}

export async function getObjects() {
  const objects = await s3.listObjects({ Bucket: "inveplus" }).promise();
  return objects;
}

export async function getObject(objectName: string) {
  const object = await s3
    .getObject({ Bucket: "inveplus", Key: objectName })
    .promise();
  return object;
}

export async function editObject(objectName: string, newObjectContent: Buffer) {
  const res = await s3
    .putObject({
      Bucket: "inveplus",
      Key: objectName,
      Body: newObjectContent,
    })
    .promise();
  return res;
}

export async function deleteObject(objectName: string) {
  const res = await s3.deleteObject({ Bucket: "inveplus", Key: objectName });
  return res;
}

export async function getObjectAtributes(objectName: string) {
  const atributes = await s3
    .headObject({ Bucket: "inveplus", Key: objectName })
    .promise();
  return atributes;
}

export async function uploadObject(objectName: string, object: Buffer) {
  const res = await s3
    .putObject({
      Bucket: "inveplus",
      Key: objectName,
      Body: object,
    })
    .promise();
  return res;
}
