CREATE TABLE IF NOT EXISTS Usuario (
    id VARCHAR(255) NOT NULL,
    -- PER-XXXXXXXXXX, 10Xs
    Nombre VARCHAR(255) NOT NULL,
    Apellidos VARCHAR(255) NOT NULL,
    LINK_Foto VARCHAR(255),
    -- The Foto is a URL
    Password VARCHAR(255),
    -- The Password is a Hash, If it is empty, the user is not logeable
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS InformacionPersonal (
    UsuarioId VARCHAR(255),
    FechaDeNacimiento DATETIME,
    --ISO 8601
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
    FOREIGN KEY (UsuarioId) REFERENCES Usuario(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS InformacionMedica (
    UsuarioId VARCHAR(255),
    ClinicaAsignada VARCHAR(255),
    TipoDeSangre VARCHAR(255),
    PRIMARY KEY (UsuarioId),
    FOREIGN KEY (UsuarioId) REFERENCES Usuario(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS FactoresAjusteSueldo (
    id VARCHAR(255) PRIMARY KEY,
    Nombre VARCHAR(255),
    Multiplicador DECIMAL(10, 2) DEFAULT 1
);
CREATE TABLE IF NOT EXISTS Horario (
    id VARCHAR(255) PRIMARY KEY,
    Nombre VARCHAR(255),
    Multiplicador VARCHAR(255),
    -- Assuming this is a foreign key to FactoresAjusteSueldo
    HoraInicio TIMESTAMP,
    HoraFin TIMESTAMP,
    ScheduleMonday BOOLEAN DEFAULT FALSE,
    ScheduleTuesday BOOLEAN DEFAULT FALSE,
    ScheduleWednesday BOOLEAN DEFAULT FALSE,
    ScheduleThursday BOOLEAN DEFAULT FALSE,
    ScheduleFriday BOOLEAN DEFAULT FALSE,
    ScheduleSaturday BOOLEAN DEFAULT FALSE,
    ScheduleSunday BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Multiplicador) REFERENCES FactoresAjusteSueldo(Nombre)
);
CREATE TABLE IF NOT EXISTS Checks (
    id VARCHAR(255),
    Horario VARCHAR(255),
    -- Assuming this is a foreign key to Horario
    Movimiento INT,
    -- 1 = CheckIn, 2 = CheckOut
    FechaYHora TIMESTAMP,
    UserChecked INT,
    -- Assuming this is a foreign key to Usuario
    UserWhoChecked INT,
    -- Assuming this is a foreign key to Usuario
    PRIMARY KEY (id),
    FOREIGN KEY (Horario) REFERENCES Horario(Nombre),
    FOREIGN KEY (UserChecked) REFERENCES Usuario(id),
    FOREIGN KEY (UserWhoChecked) REFERENCES Usuario(id)
);
CREATE TABLE IF NOT EXISTS Inventory (
    ProductID VARCHAR(255) PRIMARY KEY,
    ProductName VARCHAR(255) NOT NULL,
    SupplierID VARCHAR(255) NOT NULL,
    QuantityInStock INT NOT NULL,
    ReorderLevel INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    Location VARCHAR(255) NOT NULL,
    FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS Supplier (
    SupplierID VARCHAR(255) PRIMARY KEY,
    SupplierName VARCHAR(255) NOT NULL,
    ContactName VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(255),
    Region VARCHAR(255),
    PostalCode VARCHAR(255),
    Country VARCHAR(255),
    Phone VARCHAR(255),
    Mail VARCHAR(255)
);
-- COMMIT;