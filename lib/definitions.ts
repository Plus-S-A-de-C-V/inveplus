// export interface Date {
//   year: number;
//   month: number;
//   day: number;

//   hour?: number;
//   minute?: number;
//   second?: number;
// }

export interface InformacionPersonal {
  FechaDeNacimiento: Date;
  CURP: string;
  RFC: string;
  NSS: string;
  ClaveLector: string;
  Direccion: string;
  NumeroTelefonico: string;
  correoElectronico: string;
}

export interface InformacionMedica {
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

export interface DocumentosPersonales {
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
  // Historial?: Historial;
  checks?: Check[];
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
  { name: "ID", uid: "id", sortable: true },
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

export const productColumns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Nombre", uid: "name", sortable: true },
  { name: "Proveedor", uid: "supplier", sortable: true },
  { name: "En Stock", uid: "stock", sortable: true },
  { name: "Minimo", uid: "minimo", sortable: true },
  { name: "Precio", uid: "price", sortable: true },
  { name: "Ubicación", uid: "loc", sortable: true },
  { name: "Actions", uid: "actions" },
];

export const supplierColumns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Nombre", uid: "name", sortable: true },
  { name: "Contacto", uid: "contact", sortable: true },
  { name: "Dirección", uid: "address", sortable: true },
  { name: "Ciudad", uid: "city", sortable: true },
  { name: "Código Postal", uid: "postal", sortable: true },
  { name: "País", uid: "country", sortable: true },
  { name: "Teléfono", uid: "phone", sortable: true },
  { name: "Correo", uid: "mail", sortable: true },
  { name: "Actions", uid: "actions" },
];

export type ProductColumn = (typeof productColumns)[number];
export type SupplierColumn = (typeof supplierColumns)[number];

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

export type FactorDeSuelo = {
  id: string;
  nombre: string;
  multiplicador: number;
};

export type Horario = {
  id: string;
  nombre: string;
  multiplicador: string; // id to FactorDeSuelo
  HoraInicio: Date;
  HoraFin: Date;
  ScheduleMonday: boolean;
  ScheduleTuesday: boolean;
  ScheduleWednesday: boolean;
  ScheduleThursday: boolean;
  ScheduleFriday: boolean;
  ScheduleSaturday: boolean;
  ScheduleSunday: boolean;
};

export type Check = {
  id: string;
  userChecked: string; // id to Usuario
  movimiento: number;
  FechaYHora: Date;
  // UserChecked: string; // id to Usuario
  // UserWhoChecked: string; // id to Usuario
};
