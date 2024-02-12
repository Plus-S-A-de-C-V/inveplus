import { Surreal } from "surrealdb.js";
import * as Minio from "minio";
import { nanoid } from "nanoid";

export class FoldersNames {
  static readonly profilePictures = "profilePictures";
  // static readonly documents = "documents";
  // static readonly invoices = "invoices";
}

class DatabaseInstance {
  private db: Surreal | null = null;
  private minio: Minio.Client | null = null;

  async connectDB() {
    if (this.db) {
      console.log("DB already connected");
      return;
    }
    console.log("Attempting connect to database @ ", process.env.DB_URL);
    this.db = new Surreal();
    try {
      await this.db.connect(process.env.DB_URL || "", {
        namespace: process.env.DB_NAMESPACE || "",
        database: process.env.DB_NAME || "",

        auth: {
          namespace: process.env.DB_NAMESPACE || "",
          database: process.env.DB_NAME || "",
          // scope: process.env.DB_SCOPE || "",
          username: process.env.DB_USERNAME || "",
          password: process.env.DB_PASSWORD || "",
        },
      });
      console.log(
        "Successfully connected to database @ ",
        process.env.DB_URL || ""
      );
    } catch (error) {
      console.error(
        "Failed to connect to database @ ",
        process.env.DB_URL || ""
      );
      console.error(error);
      this.db = null;
      return;
    }
  }

  async connectS3() {
    if (this.minio) {
      console.log("S3 already connected");
      return;
    }

    console.log("Attempting to connect to S3 @ ", process.env.MINIO_ENDPOINT);
    this.minio = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || "localhost",
      port: parseInt(process.env.MINIO_PORT || "9000"),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || "",
      secretKey: process.env.MINIO_SECRET_KEY || "",
    });
  }

  async disconnect() {
    if (this.db) {
      await this.db.close();
    }
  }

  async nuevoUsuario(
    profilePicture: string,
    nombre: string,
    apellidos: string,
    password: string | null,
    fechaDeNacimiento: string,
    curp: string,
    rfc: string | null,
    nss: string | null,
    claveLector: string,
    direccion: string,
    numeroTelefonico: string,
    email: string,
    clinica: string | null,
    tipoSangre: string,
    INE: string,
    SituacionFiscal: string | null,
    NSS: string | null,
    CURP: string
  ) {
    console.log(
      "Received data: ",
      profilePicture,
      nombre,
      apellidos,
      password,
      fechaDeNacimiento,
      curp,
      rfc,
      nss,
      claveLector,
      direccion,
      numeroTelefonico,
      email,
      clinica,
      tipoSangre,
      INE,
      SituacionFiscal,
      NSS,
      CURP
    );

    console.log("Profile Picture URL: ", profilePicture);
    console.log("Nombre: ", nombre);
    console.log("Apellidos: ", apellidos);
    console.log("Password: ", password);
    console.log("Fecha de nacimiento: ", fechaDeNacimiento);
    console.log("CURP: ", curp);
    console.log("RFC: ", rfc);
    console.log("NSS: ", nss);
    console.log("Clave lector: ", claveLector);
    console.log("Direccion: ", direccion);
    console.log("Numero telefonico: ", numeroTelefonico);
    console.log("Email: ", email);
    console.log("Clinica: ", clinica);
    console.log("Tipo de sangre: ", tipoSangre);
    console.log("INE URL: ", INE);
    console.log("Situacion fiscal URL: ", SituacionFiscal);
    console.log("NSS URL: ", NSS);
    console.log("CURP URL: ", CURP);
    return "ok";
  }

  async blobToBuffer(blob: Blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer;
  }

  async uploadFile(blob: Blob, folder: string) {
    this.connectS3();

    const contentType = blob.type;
    const size = blob.size;
    const buffer = await this.blobToBuffer(blob);
    const name = nanoid() + "." + blob.type.split("/")[1];

    const objectName = folder + "/" + name;

    // TODO: Sanitize name and get thumbnail

    // Don't know how to use the etag, so we just return the name
    const res = await this.minio?.putObject("plus", objectName, buffer, size, {
      "Content-Type": contentType,
    });
    return objectName;
  }
}

const database = new DatabaseInstance();
export default database;
