// import { Surreal } from "surrealdb.js";
// import * as Minio from "minio";
import { nanoid } from "nanoid";

export class FoldersNames {
  static readonly profilePictures = "profilePictures";
  // static readonly documents = "documents";
  // static readonly invoices = "invoices";
}

// class DatabaseInstance {
//   // private db: Surreal | null = null;
//   // private minio: Minio.Client | null = null;

//   // async connectDB() {
//   //   if (this.db) {
//   //     console.log("DB already connected");
//   //     return;
//   //   }
//   //   console.log("Attempting connect to database @ ", process.env.DB_URL);
//   //   this.db = new Surreal();
//   //   try {
//   //     await this.db.connect(process.env.DB_URL || "", {
//   //       namespace: process.env.DB_NAMESPACE || "",
//   //       database: process.env.DB_NAME || "",

//   //       auth: {
//   //         namespace: process.env.DB_NAMESPACE || "",
//   //         database: process.env.DB_NAME || "",
//   //         // scope: process.env.DB_SCOPE || "",
//   //         username: process.env.DB_USERNAME || "",
//   //         password: process.env.DB_PASSWORD || "",
//   //       },
//   //     });
//   //     console.log(
//   //       "Successfully connected to database @ ",
//   //       process.env.DB_URL || ""
//   //     );
//   //   } catch (error) {
//   //     console.error(
//   //       "Failed to connect to database @ ",
//   //       process.env.DB_URL || ""
//   //     );
//   //     console.error(error);
//   //     this.db = null;
//   //     return;
//   //   }
//   // }

//   // async connectS3() {
//   //   if (this.minio) {
//   //     console.log("S3 already connected");
//   //     return;
//   //   }

//   //   console.log("Attempting to connect to S3 @ ", process.env.MINIO_ENDPOINT);
//   //   this.minio = new Minio.Client({
//   //     endPoint: process.env.MINIO_ENDPOINT || "localhost",
//   //     port: parseInt(process.env.MINIO_PORT || "9000"),
//   //     useSSL: false,
//   //     accessKey: process.env.MINIO_ACCESS_KEY || "",
//   //     secretKey: process.env.MINIO_SECRET_KEY || "",
//   //   });
//   // }

//   // async disconnect() {
//   //   if (this.db) {
//   //     await this.db.close();
//   //   }
//   // }

//   async nuevoUsuario(
//     profilePicture: string,
//     nombre: string,
//     apellidos: string,
//     password: string | null,
//     fechaDeNacimiento: string,
//     curp: string,
//     rfc: string | null,
//     nss: string | null,
//     claveLector: string,
//     direccion: string,
//     numeroTelefonico: string,
//     email: string,
//     clinica: string | null,
//     tipoSangre: string,
//     INE: string,
//     SituacionFiscal: string | null,
//     NSS: string | null,
//     CURP: string
//   ) {
//     console.log(
//       "Received data: ",
//       profilePicture,
//       nombre,
//       apellidos,
//       password,
//       fechaDeNacimiento,
//       curp,
//       rfc,
//       nss,
//       claveLector,
//       direccion,
//       numeroTelefonico,
//       email,
//       clinica,
//       tipoSangre,
//       INE,
//       SituacionFiscal,
//       NSS,
//       CURP
//     );

//     console.log("Profile Picture URL: ", profilePicture);
//     console.log("Nombre: ", nombre);
//     console.log("Apellidos: ", apellidos);
//     console.log("Password: ", password);
//     console.log("Fecha de nacimiento: ", fechaDeNacimiento);
//     console.log("CURP: ", curp);
//     console.log("RFC: ", rfc);
//     console.log("NSS: ", nss);
//     console.log("Clave lector: ", claveLector);
//     console.log("Direccion: ", direccion);
//     console.log("Numero telefonico: ", numeroTelefonico);
//     console.log("Email: ", email);
//     console.log("Clinica: ", clinica);
//     console.log("Tipo de sangre: ", tipoSangre);
//     console.log("INE URL: ", INE);
//     console.log("Situacion fiscal URL: ", SituacionFiscal);
//     console.log("NSS URL: ", NSS);
//     console.log("CURP URL: ", CURP);
//     return "ok";
//   }

//   async blobToBuffer(blob: Blob) {
//     const arrayBuffer = await blob.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     return buffer;
//   }

//   async uploadFile(blob: Blob, folder: string) {
//     this.connectS3();

//     const contentType = blob.type;
//     const size = blob.size;
//     const buffer = await this.blobToBuffer(blob);
//     const name = nanoid() + "." + blob.type.split("/")[1];

//     const objectName = folder + "/" + name;

//     // TODO: Sanitize name and get thumbnail

//     // Don't know how to use the etag, so we just return the name
//     const res = await this.minio?.putObject("plus", objectName, buffer, size, {
//       "Content-Type": contentType,
//     });
//     return objectName;
//   }
// }

// const database = new DatabaseInstance();
// export default database;

const account_id = process.env.ACCOUNT_ID;
const database_id = process.env.DATABASE_ID;
const bearer_token = process.env.BEARER_TOKEN;

const S3_API_URL = process.env.S3_API_URL || "";
const S3_API_TOKEN = process.env.S3_API_TOKEN || "";
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || "";
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "";
const ACCOUNT_ID = process.env.ACCOUNT_ID || "";

import S3 from "aws-sdk/clients/s3.js";

import { Usuario } from "@/lib/definitions";
import { ResumeIcon } from "@radix-ui/react-icons";

const s3 = new S3({
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: `${S3_ACCESS_KEY}`,
  secretAccessKey: `${S3_SECRET_ACCESS_KEY}`,
  signatureVersion: "v4",
});

export async function getUsers() {
  // fetch with post: https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}/query
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body: '{"sql":"SELECT * FROM Usuario"}',
  };

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to fetch data: ", err);
      return [];
    });

  const data = await response.result[0];

  if (!data.success) {
    console.error("Failed to fetch data: ", data);
    return [];
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
  // fetch with post: https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}/query
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body: `{"params":["${id}"],"sql":"SELECT * FROM Usuario WHERE id = ?"}`,
  };

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to fetch data: ", err);
      return null;
    });

  const data = await response.result[0];

  if (!data.success) {
    console.error("Failed to fetch data: ", data);
    return null;
  }

  const result = data.results[0];

  if (!result) {
    return null;
  }

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

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body:
      '{"params":[" ' +
      user.id +
      '","' +
      user.Nombre +
      '","' +
      user.Apellidos +
      '","' +
      user.Foto +
      '","' +
      user.Password +
      '"],"sql":"INSERT INTO Usuario (id, Nombre, Apellidos, LINK_Foto, Password) VALUES (?,?,?,?,?);"}',
  };

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to add user: ", err);
      return null;
    });

  const data = await response;

  if (!data.success) {
    console.error("Failed to add user: ", data);
    return null;
  }

  // then add the user to the personal table

  const options2 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body:
      '{"params":[" ' +
      user.id +
      '","' +
      user.InformacionPersonal?.FechaDeNacimiento +
      '","' +
      user.InformacionPersonal?.CURP +
      '","' +
      user.InformacionPersonal?.RFC +
      '","' +
      user.InformacionPersonal?.NSS +
      '","' +
      user.InformacionPersonal?.ClaveLector +
      '","' +
      user.InformacionPersonal?.Direccion +
      '","' +
      user.InformacionPersonal?.NumeroTelefonico +
      '","' +
      user.InformacionPersonal?.correoElectronico +
      '"],"sql":"INSERT INTO Personal (UsuarioId, FechaDeNacimiento, CURP, RFC, NSS, ClaveLector, Direccion, NumeroTelefonico, correoElectronico) VALUES (?,?,?,?,?,?,?,?,?);"}',
  };

  const response2 = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options2
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to add user: ", err);
      return null;
    });

  const data2 = await response2;

  if (!data2.success) {
    console.error("Failed to add user: ", data2);
    return null;
  }

  // then add the user to the medical table

  const options3 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body:
      '{"params":[" ' +
      user.id +
      '","' +
      user.InformacionMedica?.ClinicaAsignada +
      '","' +
      user.InformacionMedica?.TipoDeSangre +
      '"],"sql":"INSERT INTO Medico (UsuarioId, ClinicaAsignada, TipoDeSangre) VALUES (?,?,?);"}',
  };

  const response3 = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options3
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to add user: ", err);
      return null;
    });

  const data3 = await response3;

  if (!data3.success) {
    console.error("Failed to add user: ", data3);
    return null;
  }

  // then add the user to the documents table

  const options4 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body:
      '{"params":[" ' +
      user.id +
      '","' +
      user.DocumentosPersonales?.INE +
      '","' +
      user.DocumentosPersonales?.ConstanciaDeSituacionFiscal +
      '","' +
      user.DocumentosPersonales?.AsignacionDeNSS +
      '","' +
      user.DocumentosPersonales?.ComprobanteDeDomicilio +
      '","' +
      user.DocumentosPersonales?.CURP +
      '"],"sql":"INSERT INTO Documentos (UsuarioId, INE, ConstanciaDeSituacionFiscal, AsignacionDeNSS, ComprobanteDeDomicilio, CURP) VALUES (?,?,?,?,?,?);"}',
  };

  const response4 = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options4
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to add user: ", err);
      return null;
    });

  const data4 = await response4;

  if (!data4.success) {
    console.error("Failed to add user: ", data4);
    return null;
  }

  return data;
}

export async function updateUser(user: Usuario) {
  // first update the user in the user table

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body:
      '{"params":[" ' +
      user.Nombre +
      '","' +
      user.Apellidos +
      '","' +
      user.Foto +
      '","' +
      user.Password +
      '","' +
      user.id +
      '"],"sql":"UPDATE Usuario SET Nombre = ?, Apellidos = ?, LINK_Foto = ?, Password = ? WHERE id = ?;"}',
  };

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to update user: ", err);
      return null;
    });

  const data = await response;

  if (!data.success) {
    console.error("Failed to update user: ", data);
    return null;
  }

  // then update the user in the personal table

  const options2 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body:
      '{"params":[" ' +
      user.InformacionPersonal?.FechaDeNacimiento +
      '","' +
      user.InformacionPersonal?.CURP +
      '","' +
      user.InformacionPersonal?.RFC +
      '","' +
      user.InformacionPersonal?.NSS +
      '","' +
      user.InformacionPersonal?.ClaveLector +
      '","' +
      user.InformacionPersonal?.Direccion +
      '","' +
      user.InformacionPersonal?.NumeroTelefonico +
      '","' +
      user.InformacionPersonal?.correoElectronico +
      '","' +
      user.id +
      '"],"sql":"UPDATE Personal SET FechaDeNacimiento = ?, CURP = ?, RFC = ?, NSS = ?, ClaveLector = ?, Direccion = ?, NumeroTelefonico = ?, correoElectronico = ? WHERE UsuarioId = ?;"}',
  };

  const response2 = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options2
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to update user: ", err);
      return null;
    });

  const data2 = await response2;

  if (!data2.success) {
    console.error("Failed to update user: ", data2);
    return null;
  }

  // then update the user in the medical table

  const options3 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body:
      '{"params":[" ' +
      user.InformacionMedica?.ClinicaAsignada +
      '","' +
      user.InformacionMedica?.TipoDeSangre +
      '","' +
      user.id +
      '"],"sql":"UPDATE Medico SET ClinicaAsignada = ?, TipoDeSangre = ? WHERE UsuarioId = ?;"}',
  };

  const response3 = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options3
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to update user: ", err);
      return null;
    });

  const data3 = await response3;

  if (!data3.success) {
    console.error("Failed to update user: ", data3);
    return null;
  }

  // then update the user in the documents table

  const options4 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body:
      '{"params":[" ' +
      user.DocumentosPersonales?.INE +
      '","' +
      user.DocumentosPersonales?.ConstanciaDeSituacionFiscal +
      '","' +
      user.DocumentosPersonales?.AsignacionDeNSS +
      '","' +
      user.DocumentosPersonales?.ComprobanteDeDomicilio +
      '","' +
      user.DocumentosPersonales?.CURP +
      '","' +
      user.id +
      '"],"sql":"UPDATE Documentos SET INE = ?, ConstanciaDeSituacionFiscal = ?, AsignacionDeNSS = ?, ComprobanteDeDomicilio = ?, CURP = ? WHERE UsuarioId = ?;"}',
  };

  const response4 = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options4
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to update user: ", err);
      return null;
    });

  const data4 = await response4;

  if (!data4.success) {
    console.error("Failed to update user: ", data4);
    return null;
  }

  return data;
}

export async function deleteUser(id: string) {
  // first delete the user in the user table

  const userToDelete = await getUser(id);

  if (!userToDelete) {
    console.error("Failed to delete user: User not found");
    return null;
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body: `{"params":["${id}"],"sql":"DELETE FROM Usuario WHERE id = ?"}`,
  };

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to delete user: ", err);
      return null;
    });

  const data = await response;

  if (!data.success) {
    console.error("Failed to delete user: ", data);
    return null;
  }

  // then delete the user in the personal table

  const options2 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body: `{"params":["${id}"],"sql":"DELETE FROM Personal WHERE UsuarioId = ?"}`,
  };

  const response2 = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options2
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to delete user: ", err);
      return null;
    });

  const data2 = await response2;

  if (!data2.success) {
    console.error("Failed to delete user: ", data2);
    return null;
  }

  // then delete the user in the medical table

  const options3 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body: `{"params":["${id}"],"sql":"DELETE FROM Medico WHERE UsuarioId = ?"}`,
  };

  const response3 = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options3
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to delete user: ", err);
      return null;
    });

  const data3 = await response3;

  if (!data3.success) {
    console.error("Failed to delete user: ", data3);
    return null;
  }

  // then delete the user in the documents table

  const options4 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer_token}`,
    },
    body: `{"params":["${id}"],"sql":"DELETE FROM Documentos WHERE UsuarioId = ?"}`,
  };

  const response4 = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`,
    options4
  )
    .then((response) => response.json())
    .catch((err) => {
      console.error("Failed to delete user: ", err);
      return null;
    });

  const data4 = await response4;

  if (!data4.success) {
    console.error("Failed to delete user: ", data4);
    return null;
  }

  // Now delete all objects from the user

  deleteObject(userToDelete.Foto);

  if (userToDelete.DocumentosPersonales) {
    deleteObject(userToDelete.DocumentosPersonales.INE);
    deleteObject(userToDelete.DocumentosPersonales.ConstanciaDeSituacionFiscal);
    deleteObject(userToDelete.DocumentosPersonales.AsignacionDeNSS);
    deleteObject(userToDelete.DocumentosPersonales.ComprobanteDeDomicilio);
    deleteObject(userToDelete.DocumentosPersonales.CURP);
  }

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
