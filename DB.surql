-- Set up
BEGIN TRANSACTION;

LET $table = "Usuario";
DEFINE TABLE $table schemafull;
DEFINE FIELD Id ON TABLE $table TYPE string;
DEFINE FIELD Nombre ON TABLE $table TYPE string;
DEFINE FIELD Apellidos ON TABLE $table TYPE string;
DEFINE FIELD LINK_Foto ON TABLE $table TYPE option<string>; -- The Foto is a URL
DEFINE FIELD Password ON TABLE $table TYPE option<string>; -- The Password is a Hash, If it is empty, the user is not logeable

LET $table = "InformacionPersonal";
DEFINE TABLE $table schemafull;
DEFINE FIELD FechaDeNacimiento ON TABLE $table TYPE datetime; --ISO 8601
DEFINE FIELD CURP ON TABLE $table TYPE string;
DEFINE FIELD RFC ON TABLE $table TYPE string;
DEFINE FIELD ClaveLector ON TABLE $table TYPE string;
DEFINE FIELD Direccion ON TABLE $table TYPE string;
DEFINE FIELD NumeroTelefonico ON TABLE $table TYPE string;
DEFINE FIELD CorreoElectronico ON TABLE $table TYPE string ASSERT string::is::email($value);
DEFINE FIELD LINK_INE ON TABLE $table TYPE string;
DEFINE FIELD LINK_ConstanciaDeSituacionFiscal ON TABLE $table TYPE string;
DEFINE FIELD LINK_AsignacionDeNSS ON TABLE $table TYPE string;
DEFINE FIELD LINK_ComprobanteDeDominio ON TABLE $table TYPE string;
DEFINE FIELD LINK_CURP ON TABLE $table TYPE string;

LET $table = "InformacionMedica";
DEFINE TABLE $table schemafull;
DEFINE FIELD ClinicaAsignada ON TABLE $table TYPE string;
DEFINE FIELD TipoDeSangre ON TABLE $table TYPE string;

LET $table = "FactoresAjusteSueldo";
DEFINE TABLE $table schemafull;
DEFINE FIELD Nombre ON $table TYPE string;
DEFINE FIELD Multiplicador ON $table TYPE number DEFAULT 1;

LET $table = "Horario";
DEFINE TABLE $table schemafull;
DEFINE FIELD Nombre ON $table TYPE string;
DEFINE FIELD Multiplicador ON $table TYPE record(FactoresAjusteSueldo);
DEFINE FIELD HoraInicio ON $table TYPE timestamp;
DEFINE FIELD HoraFin ON $table TYPE timestamp;
DEFINE FIELD DiasEnUso ON $table TYPE number; // 1 = Lunes , 7 = Domingo, etc

LET $table = "Checks"
DEFINE TABLE $table SCHEMAFULL;
DEFINE FIELD Horario ON $table type record(Horario);
DEFINE FIELD Movimiento ON $table type number; // 1 = CheckIn, 2 = CheckOut
DEFINE FIELD Fecha ON $table type timestamp;
DEFINE FIELD UserChecked ON $table type record(Usuario);
DEFINE FIELD UserWhoChecked ON $table type record(Usuario);

COMMIT TRANSACTION;