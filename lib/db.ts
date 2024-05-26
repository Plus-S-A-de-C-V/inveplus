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

import {
  Usuario,
  Product,
  Supplier,
  FactorDeSuelo,
  Horario,
  Check,
} from "@/lib/definitions";

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
    sql: "SELECT id FROM Usuario",
  });

  const data = await response[0];

  if (!data.success) {
    return null;
  }

  const result = data.results;
  let users: Usuario[] = [];

  if (result) {
    const usersPromises = result.map(async (id: any) => {
      const user = await getUser(id.id);
      if (user) {
        return user;
      }

      // Return an empty object if the user does not exist
      const emptyUser: Usuario = {} as Usuario;
      return emptyUser;
    });

    users = await Promise.all(usersPromises);
  }

  return users;
}

export async function getUser(id: string) {
  // TODO: Return all data from the user
  const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `SELECT * FROM Usuario WHERE id = "${id}"`,
  });

  const data = await response[0];

  if (!data.success) {
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

  const result = _result as Usuario & {
    LINK_Foto: string;
  };
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
  try {
    if (!(await getUser(user.id))) {
      return null;
    }
  } catch (e) {
    console.log(e);
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

  let userToDelete;
  try {
    userToDelete = await getUser(id);
    if (!userToDelete) {
      return null;
    }
  } catch (e) {
    console.log(e);
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

  // await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
  //   sql: `DELETE FROM InformacionMedica WHERE UsuarioId = "${id}"`,
  // });

  // await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
  //   sql: `DELETE FROM InformacionPersonal WHERE UsuarioId = "${id}"`,
  // });

  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `DELETE FROM Usuario WHERE Id = "${id}"`,
  });

  return userToDelete;
}

/*
  Add, Update, Delete Products
*/

export async function getProducts() {
  const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: "SELECT * FROM Inventory",
  });

  const data = await response[0];

  if (!data.success) {
    return null;
  }

  const result = data.results;

  let products: Product[] = [];

  if (result) {
    products = result.map((product: any) => {
      return {
        ProductID: product.ProductID,
        ProductName: product.ProductName,
        SupplierID: product.SupplierID,
        QuantityInStock: product.QuantityInStock,
        ReorderLevel: product.ReorderLevel,
        UnitPrice: product.UnitPrice,
        Location: product.Location,
      };
    });
  }

  return products;
}

export async function getProduct(id: string) {
  const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `SELECT * FROM Inventory WHERE ProductID = "${id}"`,
  });

  const data = await response[0];
  if (!data.success) {
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

  const result = _result as Product;

  const product: Product = {
    ProductID: result.ProductID,
    ProductName: result.ProductName,
    SupplierID: result.SupplierID,
    QuantityInStock: result.QuantityInStock,
    ReorderLevel: result.ReorderLevel,
    UnitPrice: result.UnitPrice,
    Location: result.Location,
  };

  return product;
}

export async function addProduct(product: Product) {
  // first add the product to the product table

  const res = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `INSERT INTO Inventory (ProductID, ProductName, SupplierID, QuantityInStock, ReorderLevel, UnitPrice, Location) VALUES ("${product.ProductID}", "${product.ProductName}", "${product.SupplierID}", "${product.QuantityInStock}", "${product.ReorderLevel}", "${product.UnitPrice}", "${product.Location}");`,
  });
  return product;
}

export async function updateProduct(product: Product) {
  // Check if the product exists
  let productToUpdate;
  try {
    productToUpdate = await getProduct(product.ProductID);
    if (!productToUpdate) {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  // first update the product in the product table
  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `UPDATE Inventory SET ProductName = "${product.ProductName}", SupplierID = "${product.SupplierID}", QuantityInStock = "${product.QuantityInStock}", ReorderLevel = "${product.ReorderLevel}", UnitPrice = "${product.UnitPrice}", Location = "${product.Location}" WHERE ProductID = "${product.ProductID}"`,
  });

  return product;
}

export async function deleteProduct(id: string) {
  // first delete the product in the product table

  let productToDelete;
  try {
    productToDelete = await getProduct(id);
    if (!productToDelete) {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `DELETE FROM Inventory WHERE ProductID = "${id}"`,
  });

  return productToDelete;
}

/*
  Add, Update, Delete Suppliers
*/

export async function getSuppliers() {
  const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: "SELECT * FROM Supplier",
  });

  const data = await response[0];

  if (!data.success) {
    return null;
  }

  const result = data.results;

  let suppliers: Supplier[] = [];

  if (result) {
    suppliers = result.map((supplier: any) => {
      return {
        SupplierID: supplier.SupplierID,
        SupplierName: supplier.SupplierName,
        ContactName: supplier.ContactName,
        Address: supplier.Address,
        City: supplier.City,
        PostalCode: supplier.PostalCode,
        Country: supplier.Country,
        Phone: supplier.Phone,
        Mail: supplier.Mail,
      };
    });
  }

  return suppliers;
}

export async function getSupplier(id: string) {
  const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `SELECT * FROM Supplier WHERE SupplierID = "${id}"`,
  });

  const data = await response[0];

  if (!data.success) {
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

  const result = _result as Supplier;

  const supplier: Supplier = {
    SupplierID: result.SupplierID,
    SupplierName: result.SupplierName,
    ContactName: result.ContactName,
    Address: result.Address,
    City: result.City,
    PostalCode: result.PostalCode,
    Country: result.Country,
    Phone: result.Phone,
    Mail: result.Mail,
  };

  return supplier;
}

export async function addSupplier(supplier: Supplier) {
  // first add the supplier to the supplier table

  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `INSERT INTO Supplier (SupplierID, SupplierName, ContactName, Address, City, PostalCode, Country, Phone, Mail) VALUES ("${supplier.SupplierID}", "${supplier.SupplierName}", "${supplier.ContactName}", "${supplier.Address}", "${supplier.City}", "${supplier.PostalCode}", "${supplier.Country}", "${supplier.Phone}", "${supplier.Mail}");`,
  });

  return supplier;
}

export async function updateSupplier(supplier: Supplier) {
  // Check if the supplier exists
  let supplierToUpdate;
  try {
    supplierToUpdate = await getSupplier(supplier.SupplierID);
    if (!supplierToUpdate) {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  // first update the supplier in the supplier table
  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `UPDATE Supplier SET SupplierName = "${supplier.SupplierName}", ContactName = "${supplier.ContactName}", Address = "${supplier.Address}", City = "${supplier.City}", PostalCode = "${supplier.PostalCode}", Country = "${supplier.Country}", Phone = "${supplier.Phone}", Mail = "${supplier.Mail}" WHERE SupplierID = "${supplier.SupplierID}"`,
  });

  return supplier;
}

export async function deleteSupplier(id: string) {
  // first delete the supplier in the supplier table

  let supplierToDelete;
  try {
    supplierToDelete = await getSupplier(id);
    if (!supplierToDelete) {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `DELETE FROM Supplier WHERE SupplierID = "${id}"`,
  });

  return supplierToDelete;
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

// export async function getFactors() {
//   const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
//     sql: "SELECT * FROM FactoresAjusteSueldo",
//   });

//   const data = await response[0];

//   if (!data.success) {
//     return null;
//   }

//   const result = data.results;

//   let factors: FactorDeSuelo[] = [];

//   if (result) {
//     factors = result.map((factor: any) => {
//       return {
//         id: factor.id,
//         nombre: factor.nombre,
//         multiplicador: factor.multiplicador,
//       };
//     });
//   }

//   return factors;
// }

// export async function getFactor(id: string) {
//   const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
//     sql: `SELECT * FROM FactoresAjusteSueldo WHERE id = "${id}"`,
//   });

//   const data = await response[0];

//   if (!data.success) {
//     return null;
//   }

//   const _resultArray = data.results;
//   if (!_resultArray) {
//     return null;
//   }

//   const _result = _resultArray[0];

//   if (!_result) {
//     return null;
//   }

//   const result = _result;

//   const factor: FactorDeSuelo = {
//     id: result.id,
//     nombre: result.nombre,
//     multiplicador: result.multiplicador,
//   };

//   return factor;
// }

// export async function addFactor(factor: FactorDeSuelo) {
//   // first add the factor to the factor table

//   await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
//     sql: `INSERT INTO FactoresAjusteSueldo (id, Nombre, Multiplicador) VALUES ("${factor.id}", "${factor.nombre}", "${factor.multiplicador}");`,
//   });

//   return factor;
// }

// export async function updateFactor(factor: FactorDeSuelo) {
//   // Check if the factor exists
//   let factorToUpdate;
//   try {
//     factorToUpdate = await getFactor(factor.id);
//     if (!factorToUpdate) {
//       return null;
//     }
//   } catch (e) {
//     console.log(e);
//     return null;
//   }

//   // first update the factor in the factor table
//   await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
//     sql: `UPDATE FactoresAjusteSueldo SET Nombre = "${factor.nombre}", Multiplicador = "${factor.multiplicador}" WHERE id = "${factor.id}"`,
//   });

//   return factor;
// }

// export async function deleteFactor(id: string) {
//   // first delete the factor in the factor table

//   let factorToDelete;
//   try {
//     factorToDelete = await getFactor(id);
//     if (!factorToDelete) {
//       return null;
//     }
//   } catch (e) {
//     console.log(e);
//     return null;
//   }

//   await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
//     sql: `DELETE FROM FactoresAjusteSueldo WHERE id = "${id}"`,
//   });

//   return factorToDelete;
// }

// export async function getHorarios() {
//   const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
//     sql: "SELECT * FROM Horario",
//   });

//   const data = await response[0];

//   if (!data.success) {
//     return null;
//   }

//   const result = data.results;

//   let horarios: Horario[] = [];

//   if (result) {
//     horarios = result.map((horario: any) => {
//       return {
//         id: horario.id,
//         nombre: horario.nombre,
//         multiplicador: horario.multiplicador,
//         HoraInicio: horario.HoraInicio,
//         HoraFin: horario.HoraFin,
//         ScheduleMonday: horario.ScheduleMonday,
//         ScheduleTuesday: horario.ScheduleTuesday,
//         ScheduleWednesday: horario.ScheduleWednesday,
//         ScheduleThursday: horario.ScheduleThursday,
//         ScheduleFriday: horario.ScheduleFriday,
//         ScheduleSaturday: horario.ScheduleSaturday,
//         ScheduleSunday: horario.ScheduleSunday,
//       };
//     });
//   }

//   return horarios;
// }

// export async function getHorario(id: string) {
//   const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
//     sql: `SELECT * FROM Horario WHERE id = "${id}"`,
//   });

//   const data = await response[0];

//   if (!data.success) {
//     return null;
//   }

//   const _resultArray = data.results;
//   if (!_resultArray) {
//     return null;
//   }

//   const _result = _resultArray[0];

//   if (!_result) {
//     return null;
//   }

//   const result = _result;

//   const horario: Horario = {
//     id: result.id,
//     nombre: result.nombre,
//     multiplicador: result.multiplicador,
//     HoraInicio: result.HoraInicio,
//     HoraFin: result.HoraFin,
//     ScheduleMonday: result.ScheduleMonday,
//     ScheduleTuesday: result.ScheduleTuesday,
//     ScheduleWednesday: result.ScheduleWednesday,
//     ScheduleThursday: result.ScheduleThursday,
//     ScheduleFriday: result.ScheduleFriday,
//     ScheduleSaturday: result.ScheduleSaturday,
//     ScheduleSunday: result.ScheduleSunday,
//   };

//   return horario;
// }

// export async function addHorario(horario: Horario) {
//   // first add the horario to the horario table

//   await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
//     sql: `INSERT INTO Horario (id, nombre, multiplicador, HoraInicio, HoraFin, ScheduleMonday, ScheduleTuesday, ScheduleWednesday, ScheduleThursday, ScheduleFriday, ScheduleSaturday, ScheduleSunday) VALUES ("${horario.id}", "${horario.nombre}", "${horario.multiplicador}", "${horario.HoraInicio}", "${horario.HoraFin}", "${horario.ScheduleMonday}", "${horario.ScheduleTuesday}", "${horario.ScheduleWednesday}", "${horario.ScheduleThursday}", "${horario.ScheduleFriday}", "${horario.ScheduleSaturday}", "${horario.ScheduleSunday}");`,
//   });

//   return horario;
// }

// export async function updateHorario(horario: Horario) {
//   // Check if the horario exists
//   let horarioToUpdate;
//   try {
//     horarioToUpdate = await getHorario(horario.id);
//     if (!horarioToUpdate) {
//       return null;
//     }
//   } catch (e) {
//     console.log(e);
//     return null;
//   }

//   // first update the horario in the horario table
//   await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
//     sql: `UPDATE Horario SET nombre = "${horario.nombre}", multiplicador = "${horario.multiplicador}", HoraInicio = "${horario.HoraInicio}", HoraFin = "${horario.HoraFin}", ScheduleMonday = "${horario.ScheduleMonday}", ScheduleTuesday = "${horario.ScheduleTuesday}", ScheduleWednesday = "${horario.ScheduleWednesday}", ScheduleThursday = "${horario.ScheduleThursday}", ScheduleFriday = "${horario.ScheduleFriday}", ScheduleSaturday = "${horario.ScheduleSaturday}", ScheduleSunday = "${horario.ScheduleSunday}" WHERE id = "${horario.id}"`,
//   });

//   return horario;
// }

// export async function deleteHorario(id: string) {
//   // first delete the horario in the horario table

//   let horarioToDelete;
//   try {
//     horarioToDelete = await getHorario(id);
//     if (!horarioToDelete) {
//       return null;
//     }
//   } catch (e) {
//     console.log(e);
//     return null;
//   }

//   await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
//     sql: `DELETE FROM Horario WHERE id = "${id}"`,
//   });

//   return horarioToDelete;
// }

export async function getChecks() {
  const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: "SELECT id FROM Checks",
  });

  const data = await response[0];

  if (!data.success) {
    return null;
  }

  const result = data.results;

  let checks: Check[] = [];

  if (result) {
    checks = await Promise.all(
      result.map(async (check: any) => {
        const checkObject = await getCheck(check.id);
        if (checkObject) {
          return checkObject;
        }

        const emptyCheck: Check = {} as Check;
        return emptyCheck;
      })
    );
  }

  return checks;
}

export async function getCheck(id: string) {
  const response = await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `SELECT * FROM Checks WHERE id = "${id}"`,
  });

  const data = await response[0];

  if (!data.success) {
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

  const check: Check = {
    id: result.id,
    userChecked: result.UserChecked,
    movimiento: result.Movimiento,
    FechaYHora: result.FechaYHora,
  };

  return check;
}

export async function addCheck(check: Check) {
  // first add the check to the check table

  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `INSERT INTO Checks (id, Movimiento, FechaYHora, UserChecked) VALUES ("${check.id}", "${check.movimiento}", "${check.FechaYHora}", "${check.userChecked}");`,
  });

  return check;
}

export async function updateCheck(check: Check) {
  // Check if the check exists
  let checkToUpdate;
  try {
    checkToUpdate = await getCheck(check.id);
    if (!checkToUpdate) {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  // first update the check in the check table
  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `UPDATE Checks SET Movimiento = "${check.movimiento}", FechaYHora = "${check.FechaYHora}", UserChecked = "${check.userChecked}" WHERE id = "${check.id}"`,
  });

  return check;
}

export async function deleteCheck(id: string) {
  // first delete the check in the check table

  let checkToDelete;
  try {
    checkToDelete = await getCheck(id);
    if (!checkToDelete) {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  await cloudflare.d1.database.query(ACCOUNT_ID, DATABASE_ID, {
    sql: `DELETE FROM Checks WHERE id = "${id}"`,
  });

  return checkToDelete;
}
