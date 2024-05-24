export interface Date {
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
  { name: "Nombre", uid: "persona", sortable: true },
  // { name: "Edad", uid: "edad", sortable: true },
  // { name: "Rol", uid: "rol", sortable: true },
  // { name: "ESTADO", uid: "estado", sortable: true },
  { name: "Correo Electronico", uid: "email" },
  { name: "Numero Telefonico", uid: "numero" },
  { name: "Direccion", uid: "direccion" },
  { name: "Clinica Asignada", uid: "clinica" },
  { name: "Tipo de Sangre", uid: "sangre" },
  { name: "Fecha de Nacimiento", uid: "nacimiento" },
  { name: "CURP", uid: "curp" },
  { name: "RFC", uid: "rfc" },
  { name: "Clabe de Lector", uid: "lector" },
  { name: "Actions", uid: "actions" },
];

// Export column type
export type Column = (typeof usersColumns)[number];

export type Product = {
  ProductID: string;
  ProductName: string;
  SupplierID: string;
  QuantityInStock: number;
  ReorderLevel: number;
  UnitPrice: number;
  Location: string;
};

export type Supplier = {
  SupplierID: string;
  SupplierName: string;
  ContactName: string;
  Address: string;
  City: string;
  PostalCode: string;
  Country: string;
  Phone: string;
  Mail: string;
};
