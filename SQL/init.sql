CREATE TABLE IF NOT EXISTS Usuario (
    id VARCHAR(255) NOT NULL, -- PER-XXXXXXXXXX, 10Xs
    Nombre VARCHAR(255) NOT NULL,
    Apellidos VARCHAR(255) NOT NULL,
    LINK_Foto VARCHAR(255), -- The Foto is a URL
    Password VARCHAR(255), -- The Password is a Hash, If it is empty, the user is not logeable

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS InformacionPersonal (
    UsuarioId VARCHAR(255),
    FechaDeNacimiento DATETIME, --ISO 8601
    CURP VARCHAR(255),
    RFC VARCHAR(255),
    ClaveLector VARCHAR(255),
    Direccion VARCHAR(255),
    NumeroTelefonico VARCHAR(255), 
    CorreoElectronico VARCHAR(255),
    LINK_INE VARCHAR(255),
    LINK_ConstanciaDeSituacionFiscal VARCHAR(255),
    LINK_AsignacionDeNSS VARCHAR(255),
    LINK_ComprobanteDeDominio VARCHAR(255),
    LINK_CURP VARCHAR(255),

    PRIMARY KEY (UsuarioId),
    FOREIGN KEY (UsuarioId) REFERENCES Usuario(id)
);

CREATE TABLE IF NOT EXISTS InformacionMedica (
    UsuarioId VARCHAR(255),
    ClinicaAsignada VARCHAR(255),
    TipoDeSangre VARCHAR(255),

    PRIMARY KEY (UsuarioId),
    FOREIGN KEY (UsuarioId) REFERENCES Usuario(id)
);

CREATE TABLE IF NOT EXISTS FactoresAjusteSueldo (
    Nombre VARCHAR(255) PRIMARY KEY,
    Multiplicador DECIMAL(10,2) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS Checks (
    id VARCHAR(255),
    Horario VARCHAR(255), -- Assuming this is a foreign key to Horario
    Movimiento INT, -- 1 = CheckIn, 2 = CheckOut
    Fecha TIMESTAMP,
    UserChecked INT, -- Assuming this is a foreign key to Usuario
    UserWhoChecked INT, -- Assuming this is a foreign key to Usuario

    PRIMARY KEY (id, Horario),
    FOREIGN KEY (Horario) REFERENCES Horario(Nombre),
    FOREIGN KEY (UserChecked) REFERENCES Usuario(id),
    FOREIGN KEY (UserWhoChecked) REFERENCES Usuario(id)
);

CREATE TABLE IF NOT EXISTS Horario (
    Nombre VARCHAR(255) PRIMARY KEY,
    Multiplicador VARCHAR(255), -- Assuming this is a foreign key to FactoresAjusteSueldo
    HoraInicio TIMESTAMP,
    HoraFin TIMESTAMP,
    DiasEnUso INT, -- 1 = Lunes , 7 = Domingo, etc

    FOREIGN KEY (Multiplicador) REFERENCES FactoresAjusteSueldo(Nombre)
);
-- COMMIT;