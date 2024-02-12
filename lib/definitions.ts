interface Date {
  year: number;
  month: number;
  day: number;

  hour?: number;
  minute?: number;
  second?: number;
}

interface InformacionPersonal {
  FechaDeNacimiento: Date;
  CURP: string;
  RFC: string;
  NSS: string;
  ClaveLector: string;
  Direccion: string;
  NumeroTelefonico: string;
  correoElectronico: string;
}

interface InformacionMedica {
  ClinicaAsignada: string;
  TipoDeSangre: string;
}

enum Estado {
  Activo,
  Inactivo,
  Indefinido,
}

interface CambioDeEstado {
  fecha: Date;
  estadoAnterior: Estado;
  estadoCambiado: Estado;
}

interface DocumentosPersonales {
  // URL TO S3 OBJECTS, ALL PDFs
  INE: string;
  ConstanciaDeSituacionFiscal: string;
  AsignacionDeNSS: string;
  ComprobanteDeDomicilio: string;
  CURP: string;
}

interface Historial {
  CambiosDeEstado: CambioDeEstado[];
}

export interface Usuario {
  id: string;
  Nombre: string;
  Apellidos: string;
  Foto: string;
  Password: string;

  InformacionPersonal?: InformacionPersonal;
  InformacionMedica?: InformacionMedica;
  DocumentosPersonales?: DocumentosPersonales;
  Historial?: Historial;
}

export const statusOptions = [
  { name: "Activo", uid: "activo" },
  { name: "Inactivo", uid: "inactivo" },
  { name: "Indefinido", uid: "indefinido" },
];

export const statusOptionsColorMap = {
  activo: "success",
  inactivo: "danger",
  indefinido: "warning",
};

export const INITIAL_VISIBLE_COLUMNS = ["persona", "rol", "numero"];

export const usersColumns = [
  { name: "PERSONA", uid: "persona", sorteable: true },
  { name: "EDAD", uid: "edad", sorteable: true },
  { name: "ROL", uid: "rol", sorteable: true },
  // { name: "ESTADO", uid: "estado", sorteable: true },
  { name: "EMAIL", uid: "email" },
  { name: "NUMERO", uid: "numero" },
];
