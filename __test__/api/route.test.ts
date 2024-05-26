// import "@testing-library/jest-dom";
// require('dotenv').config();
require("dotenv").config({ path: ".env.local" });
import {
  getUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
  // getFactors,
  // getFactor,
  // addFactor,
  // updateFactor,
  // deleteFactor,
} from "@/lib/db";
import {
  getProducts,
  getProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/db";
import {
  getSuppliers,
  getSupplier,
  addSupplier,
  deleteSupplier,
  updateSupplier,
} from "@/lib/db";
import {
  Product,
  Usuario,
  Supplier,
  FactorDeSuelo,
  Horario,
  Check,
} from "@/lib/definitions";

// import {
//   getHorarios,
//   getHorario,
//   addHorario,
//   deleteHorario,
//   updateHorario,
// } from "@/lib/db";

import {
  getChecks,
  getCheck,
  addCheck,
  deleteCheck,
  updateCheck,
} from "@/lib/db";

import { Date } from "@/lib/definitions";

describe("[LIB]", () => {
  describe("Users", () => {
    describe("Get Users", () => {
      test("All users", async () => {
        expect(await getUsers()).not.toBeNull();
      });

      test("Existing User", async () => {
        const newUser: Usuario = {
          id: "PER-e9ZStNvTpH",
          Nombre: "Test",
          Apellidos: "User",
          Foto: "https://via.placeholder.com/150",
          Password: "123456",
        };

        await deleteUser(newUser.id);
        await addUser(newUser);
        const result = await getUser(newUser.id);

        expect(result).not.toBeNull();
        await deleteUser(newUser.id);
      });

      test("Non-Existing User", async () => {
        const result = await getUser("");
        expect(result).toBeNull();
      });
    });

    describe("Add User", () => {
      test("Add user", async () => {
        const newUser: Usuario = {
          id: "PER-123456789",
          Nombre: "Test",
          Apellidos: "User",
          Foto: "https://via.placeholder.com/150",
          Password: "123456",
        };

        await deleteUser(newUser.id);
        const result = await addUser(newUser);
        expect(result).not.toBeNull();
        await deleteUser(newUser.id);
      }, 30000);
    });

    describe("Delete User", () => {
      test("Existing User", async () => {
        const newUser: Usuario = {
          id: "PER-123456789",
          Nombre: "Test",
          Apellidos: "User",
          Foto: "https://via.placeholder.com/150",
          Password: "123456",
        };

        await deleteUser(newUser.id);
        await addUser(newUser);

        await getUser(newUser.id);
        await deleteUser(newUser.id);

        const result = await getUser(newUser.id);
        expect(result).toBeNull();
      }, 30000);

      test("Non-existing User", async () => {
        const result = await deleteUser("PER-123456789");
        expect(result).toBeNull();
      });
    });

    describe("Update User", () => {
      test("Existing User", async () => {
        const user: Usuario = {
          id: "PER-123456789",
          Nombre: "Test",
          Apellidos: "User",
          Foto: "https://via.placeholder.com/150",
          Password: "123456",
        };

        await deleteUser(user.id);
        await addUser(user);

        const updatedUser: Usuario = {
          id: user.id,
          Nombre: "Updated",
          Apellidos: "User",
          Foto: "https://via.placeholder.com/150",
          Password: "123456",
        };

        await updateUser(updatedUser);

        const result = await getUser(user.id);
        expect(result).not.toBeNull();
        expect(result?.Nombre).toBe("Updated");

        await deleteUser(user.id);
      }, 30000);

      test("Non-existing User", async () => {
        const user: Usuario = {
          id: "PER-123456789",
          Nombre: "Test",
          Apellidos: "User",
          Foto: "https://via.placeholder.com/150",
          Password: "123456",
        };

        const result = await updateUser(user);
        expect(result).toBeNull();
      });
    });
  });

  describe("Products", () => {
    describe("Get Products", () => {
      test("All products", async () => {
        expect(await getProducts()).not.toBeNull();
      });

      test("Existing Product", async () => {
        const testSupplier: Supplier = {
          SupplierID: "SUP-123456789",
          SupplierName: "Test",
          ContactName: "Test",
          Address: "Test",
          City: "Test",
          PostalCode: "Test",
          Country: "Test",
          Phone: "Test",
          Mail: "Test",
        };
        const product: Product = {
          ProductID: "PRO-123456789",
          ProductName: "Test",
          SupplierID: "SUP-123456789",
          QuantityInStock: 10,
          ReorderLevel: 5,
          UnitPrice: 100,
          Location: "Test",
        };

        await addSupplier(testSupplier);
        await addProduct(product);

        const result = await getProduct(product.ProductID);
        expect(result).not.toBeNull();

        await deleteProduct(product.ProductID);
        await deleteSupplier(testSupplier.SupplierID);
      });

      test("Non-Existing Product", async () => {
        const result = await getProduct("");
        expect(result).toBeNull();
      });
    });

    describe("Add Product", () => {
      test("Add product", async () => {
        const testSupplier: Supplier = {
          SupplierID: "SUP-123456789",
          SupplierName: "Test",
          ContactName: "Test",
          Address: "Test",
          City: "Test",
          PostalCode: "Test",
          Country: "Test",
          Phone: "Test",
          Mail: "Test",
        };

        await deleteSupplier(testSupplier.SupplierID);
        await addSupplier(testSupplier);

        const newProduct: Product = {
          ProductID: "PRO-123456789",
          ProductName: "Test",
          SupplierID: "SUP-123456789",
          QuantityInStock: 10,
          ReorderLevel: 5,
          UnitPrice: 100,
          Location: "Test",
        };

        await deleteProduct(newProduct.ProductID);
        await addProduct(newProduct);

        const result = await getProduct(newProduct.ProductID);
        expect(result).not.toBeNull();

        await deleteProduct(newProduct.ProductID);
        await deleteSupplier(testSupplier.SupplierID);
      }, 30000);
    });

    describe("Delete Product", () => {
      test("Existing Product", async () => {
        const testSupplier: Supplier = {
          SupplierID: "SUP-123456789",
          SupplierName: "Test",
          ContactName: "Test",
          Address: "Test",
          City: "Test",
          PostalCode: "Test",
          Country: "Test",
          Phone: "Test",
          Mail: "Test",
        };

        await deleteSupplier(testSupplier.SupplierID);
        await addSupplier(testSupplier);

        const newProduct: Product = {
          ProductID: "PRO-123456789",
          ProductName: "Test",
          SupplierID: "SUP-123456789",
          QuantityInStock: 10,
          ReorderLevel: 5,
          UnitPrice: 100,
          Location: "Test",
        };

        await deleteProduct(newProduct.SupplierID);
        await addProduct(newProduct);

        await getProduct(newProduct.SupplierID);
        await deleteProduct(newProduct.SupplierID);

        const result = await getProduct(newProduct.SupplierID);
        expect(result).toBeNull();
        await deleteSupplier(testSupplier.SupplierID);
      }, 30000);

      test("Non-existing Product", async () => {
        const result = await deleteProduct("PRO-123456789");
        expect(result).toBeNull();
      });
    });

    describe("Update Product", () => {
      test("Existing Product", async () => {
        const testSupplier: Supplier = {
          SupplierID: "SUP-123456789",
          SupplierName: "Test",
          ContactName: "Test",
          Address: "Test",
          City: "Test",
          PostalCode: "Test",
          Country: "Test",
          Phone: "Test",
          Mail: "Test",
        };

        await deleteSupplier(testSupplier.SupplierID);
        await addSupplier(testSupplier);
        const product: Product = {
          ProductID: "PRO-123456789",
          ProductName: "Test",
          SupplierID: "SUP-123456789",
          QuantityInStock: 10,
          ReorderLevel: 5,
          UnitPrice: 100,
          Location: "Test",
        };

        await deleteProduct(product.SupplierID);
        await addProduct(product);

        const updatedProduct: Product = {
          ProductID: product.ProductID,
          ProductName: "Updated",
          SupplierID: product.SupplierID,
          QuantityInStock: 10,
          ReorderLevel: 5,
          UnitPrice: 100,
          Location: "Test",
        };

        const result = await updateProduct(updatedProduct);
        expect(result).not.toBeNull();
        expect(result?.ProductName).toBe("Updated");

        await deleteProduct(product.SupplierID);
        await deleteSupplier(testSupplier.SupplierID);
      }, 30000);

      test("Non-existing Product", async () => {
        const updatedProduct: Product = {
          ProductID: "PRO-123456789",
          ProductName: "Updated",
          SupplierID: "SUP-123456789",
          QuantityInStock: 10,
          ReorderLevel: 5,
          UnitPrice: 100,
          Location: "Test",
        };
        const result = await updateProduct(updatedProduct);
        expect(result).toBeNull();
      });
    });
  });

  describe("Suppliers", () => {
    describe("Get Suppliers", () => {
      test("All suppliers", async () => {
        expect(await getSuppliers()).not.toBeNull();
      });

      test("Existing Supplier", async () => {
        // Add a supplier to test
        const supplier: Supplier = {
          SupplierID: "SUP-123456789",
          SupplierName: "Test",
          ContactName: "Test",
          Address: "Test",
          City: "Test",
          PostalCode: "Test",
          Country: "Test",
          Phone: "Test",
          Mail: "Test",
        };

        await addSupplier(supplier);

        const result = await getSupplier("SUP-123456789");
        expect(result).not.toBeNull();

        await deleteSupplier("SUP-123456789");
      });

      test("Non-Existing Supplier", async () => {
        const result = await getSupplier("");
        expect(result).toBeNull();
      });
    });

    describe("Add Supplier", () => {
      test("Add supplier", async () => {
        const newSupplier: Supplier = {
          SupplierID: "SUP-123456789",
          SupplierName: "Test",
          ContactName: "Test",
          Address: "Test",
          City: "Test",
          PostalCode: "Test",
          Country: "Test",
          Phone: "Test",
          Mail: "Test",
        };

        await deleteSupplier(newSupplier.SupplierID);
        await addSupplier(newSupplier);

        const result = await getSupplier(newSupplier.SupplierID);
        expect(result).not.toBeNull();

        await deleteSupplier(newSupplier.SupplierID);
      }, 30000);
    });

    describe("Delete Supplier", () => {
      test("Existing Supplier", async () => {
        const newSupplier: Supplier = {
          SupplierID: "SUP-123456789",
          SupplierName: "Test",
          ContactName: "Test",
          Address: "Test",
          City: "Test",
          PostalCode: "Test",
          Country: "Test",
          Phone: "Test",
          Mail: "Test",
        };

        await deleteSupplier(newSupplier.SupplierID);
        await addSupplier(newSupplier);

        await getSupplier(newSupplier.SupplierID);
        await deleteSupplier(newSupplier.SupplierID);

        const result = await getSupplier(newSupplier.SupplierID);
        expect(result).toBeNull();
      }, 30000);

      test("Non-existing Supplier", async () => {
        const result = await deleteSupplier("SUP-123456789");
        expect(result).toBeNull();
      });
    });

    describe("Update Supplier", () => {
      test("Existing Supplier", async () => {
        const supplier: Supplier = {
          SupplierID: "SUP-123456789",
          SupplierName: "Test",
          ContactName: "Test",
          Address: "Test",
          City: "Test",
          PostalCode: "Test",
          Country: "Test",
          Phone: "Test",
          Mail: "Test",
        };

        await deleteSupplier(supplier.SupplierID);
        await addSupplier(supplier);

        const updatedSupplier: Supplier = {
          SupplierID: supplier.SupplierID,
          SupplierName: "Updated",
          ContactName: "Test",
          Address: "Test",
          City: "Test",
          PostalCode: "Test",
          Country: "Test",
          Phone: "Test",
          Mail: "Test",
        };

        const result = await updateSupplier(updatedSupplier);
        expect(result).not.toBeNull();
        expect(result?.SupplierName).toBe("Updated");

        await deleteSupplier(supplier.SupplierID);
      }, 30000);

      test("Non-existing Supplier", async () => {
        const updatedSupplier: Supplier = {
          SupplierID: "SUP-123456789",
          SupplierName: "Updated",
          ContactName: "Test",
          Address: "Test",
          City: "Test",
          PostalCode: "Test",
          Country: "Test",
          Phone: "Test",
          Mail: "Test",
        };
        const result = await updateSupplier(updatedSupplier);
        expect(result).toBeNull();
      });
    });
  });

  // describe("Factores de Suelo", () => {
  //   describe("Get Factores de Sueldo", () => {
  //     test("All Factores de Suelo", async () => {
  //       expect(await getFactors()).not.toBeNull();
  //     });

  //     test("Existing Factor de Suelo", async () => {
  //       const factor: FactorDeSuelo = {
  //         id: "FDS-123456789",
  //         nombre: "Test",
  //         multiplicador: 1.5,
  //       };

  //       await deleteFactor(factor.id);
  //       await addFactor(factor);
  //       const result = await getFactor(factor.id);

  //       // Must be the same factor
  //       expect(result).not.toBeNull();

  //       await deleteFactor(factor.id);
  //     });

  //     test("Non-Existing Factor de Suelo", async () => {
  //       const result = await getFactor("");
  //       expect(result).toBeNull();
  //     });
  //   });

  //   describe("Add Factor de Sueldo", () => {
  //     test("Add factor de sueldo", async () => {
  //       const newFactor: FactorDeSuelo = {
  //         id: "FDS-123456789",
  //         nombre: "Test",
  //         multiplicador: 1.5,
  //       };

  //       await deleteFactor(newFactor.id);
  //       await addFactor(newFactor);

  //       const result = await getFactor(newFactor.id);
  //       expect(result).not.toBeNull();

  //       await deleteFactor(newFactor.id);
  //     }, 30000);
  //   });

  //   describe("Delete Factor de Sueldo", () => {
  //     test("Existing Factor de Suelo", async () => {
  //       const newFactor: FactorDeSuelo = {
  //         id: "FDS-123456789",
  //         nombre: "Test",
  //         multiplicador: 1.5,
  //       };

  //       await deleteFactor(newFactor.id);
  //       await addFactor(newFactor);

  //       await getFactor(newFactor.id);
  //       await deleteFactor(newFactor.id);

  //       const result = await getFactor(newFactor.id);
  //       expect(result).toBeNull();
  //     }, 30000);

  //     test("Non-existing Factor de Suelo", async () => {
  //       const result = await deleteFactor("FDS-123456789");
  //       expect(result).toBeNull();
  //     });
  //   });

  //   describe("Update Factor de Sueldo", () => {
  //     test("Existing Factor de Suelo", async () => {
  //       const factor: FactorDeSuelo = {
  //         id: "FDS-123456789",
  //         nombre: "Test",
  //         multiplicador: 1.5,
  //       };

  //       await deleteFactor(factor.id);
  //       await addFactor(factor);

  //       const updatedFactor: FactorDeSuelo = {
  //         id: factor.id,
  //         nombre: "Updated",
  //         multiplicador: 1.5,
  //       };

  //       await updateFactor(updatedFactor);

  //       const result = await getFactor(factor.id);
  //       expect(result).not.toBeNull();
  //       expect(result?.nombre).toBe("Updated");

  //       await deleteFactor(factor.id);
  //     }, 30000);

  //     test("Non-existing Factor de Suelo", async () => {
  //       const factor: FactorDeSuelo = {
  //         id: "FDS-123456789",
  //         nombre: "Test",
  //         multiplicador: 1.5,
  //       };

  //       const result = await updateFactor(factor);
  //       expect(result).toBeNull();
  //     });
  //   });
  // });

  // describe("Horarios", () => {
  //   describe("Get Horarios", () => {
  //     test("All Horarios", async () => {
  //       expect(await getHorarios()).not.toBeNull();
  //     });

  //     test("Existing Horario", async () => {
  //       const factor: FactorDeSuelo = {
  //         id: "FDS-123456789",
  //         nombre: "Test",
  //         multiplicador: 1.5,
  //       };

  //       const fecha: Date = {
  //         day: 1,
  //         month: 1,
  //         year: 2021,
  //         hour: 12,
  //         minute: 0,
  //         second: 0,
  //       };

  //       const horario: Horario = {
  //         id: "HOR-123456789",
  //         nombre: "Test",
  //         multiplicador: factor.id,
  //         HoraInicio: fecha,
  //         HoraFin: fecha,
  //         ScheduleMonday: true,
  //         ScheduleTuesday: true,
  //         ScheduleWednesday: true,
  //         ScheduleThursday: true,
  //         ScheduleFriday: true,
  //         ScheduleSaturday: true,
  //         ScheduleSunday: true,
  //       };

  //       await addFactor(factor);
  //       await addHorario(horario);

  //       const result = await getHorario(horario.id);
  //       expect(result).not.toBeNull();

  //       await deleteHorario(horario.id);
  //       await deleteFactor(factor.id);
  //     });

  //     test("Non-Existing Horario", async () => {
  //       const result = await getHorario("");
  //       expect(result).toBeNull();
  //     });
  //   });

  //   describe("Add Horario", () => {
  //     test("Add horario", async () => {
  //       const factor: FactorDeSuelo = {
  //         id: "FDS-123456789",
  //         nombre: "Test",
  //         multiplicador: 1.5,
  //       };

  //       await deleteFactor(factor.id);
  //       await addFactor(factor);

  //       const fecha: Date = {
  //         day: 1,
  //         month: 1,
  //         year: 2021,
  //         hour: 12,
  //         minute: 0,
  //         second: 0,
  //       };

  //       const newHorario: Horario = {
  //         id: "HOR-123456789",
  //         nombre: "Test",
  //         multiplicador: factor.id,
  //         HoraInicio: fecha,
  //         HoraFin: fecha,
  //         ScheduleMonday: true,
  //         ScheduleTuesday: true,
  //         ScheduleWednesday: true,
  //         ScheduleThursday: true,
  //         ScheduleFriday: true,
  //         ScheduleSaturday: true,
  //         ScheduleSunday: true,
  //       };

  //       await deleteHorario(newHorario.id);
  //       await addHorario(newHorario);

  //       const result = await getHorario(newHorario.id);
  //       expect(result).not.toBeNull();

  //       await deleteHorario(newHorario.id);
  //       await deleteFactor(factor.id);
  //     }, 30000);
  //   });

  //   describe("Delete Horario", () => {
  //     test("Existing Horario", async () => {
  //       const factor: FactorDeSuelo = {
  //         id: "FDS-123456789",
  //         nombre: "Test",
  //         multiplicador: 1.5,
  //       };

  //       await deleteFactor(factor.id);
  //       await addFactor(factor);

  //       const fecha: Date = {
  //         day: 1,
  //         month: 1,
  //         year: 2021,
  //         hour: 12,
  //         minute: 0,
  //         second: 0,
  //       };

  //       const newHorario: Horario = {
  //         id: "HOR-123456789",
  //         nombre: "Test",
  //         multiplicador: factor.id,
  //         HoraInicio: fecha,
  //         HoraFin: fecha,
  //         ScheduleMonday: true,
  //         ScheduleTuesday: true,
  //         ScheduleWednesday: true,
  //         ScheduleThursday: true,
  //         ScheduleFriday: true,
  //         ScheduleSaturday: true,
  //         ScheduleSunday: true,
  //       };

  //       await deleteHorario(newHorario.id);
  //       await addHorario(newHorario);

  //       await getHorario(newHorario.id);
  //       await deleteHorario(newHorario.id);

  //       const result = await getHorario(newHorario.id);
  //       expect(result).toBeNull();
  //       await deleteFactor(factor.id);
  //     }, 30000);

  //     test("Non-existing Horario", async () => {
  //       const result = await deleteHorario("HOR-123456789");
  //       expect(result).toBeNull();
  //     });
  //   });

  //   describe("Update Horario", () => {
  //     test("Existing Horario", async () => {
  //       const factor: FactorDeSuelo = {
  //         id: "FDS-123456789",
  //         nombre: "Test",
  //         multiplicador: 1.5,
  //       };

  //       await deleteFactor(factor.id);
  //       await addFactor(factor);

  //       const fecha: Date = {
  //         day: 1,
  //         month: 1,
  //         year: 2021,
  //         hour: 12,
  //         minute: 0,
  //         second: 0,
  //       };

  //       const horario: Horario = {
  //         id: "HOR-123456789",
  //         nombre: "Test",
  //         multiplicador: factor.id,
  //         HoraInicio: fecha,
  //         HoraFin: fecha,
  //         ScheduleMonday: true,
  //         ScheduleTuesday: true,
  //         ScheduleWednesday: true,
  //         ScheduleThursday: true,
  //         ScheduleFriday: true,
  //         ScheduleSaturday: true,
  //         ScheduleSunday: true,
  //       };

  //       await deleteHorario(horario.id);
  //       await addHorario(horario);

  //       const updatedHorario: Horario = {
  //         id: horario.id,
  //         nombre: "Updated",
  //         multiplicador: factor.id,
  //         HoraInicio: fecha,
  //         HoraFin: fecha,
  //         ScheduleMonday: true,
  //         ScheduleTuesday: true,
  //         ScheduleWednesday: true,
  //         ScheduleThursday: true,
  //         ScheduleFriday: true,
  //         ScheduleSaturday: true,
  //         ScheduleSunday: true,
  //       };

  //       await updateHorario(updatedHorario);

  //       const result = await getHorario(horario.id);
  //       expect(result).not.toBeNull();
  //       expect(result?.nombre).toBe("Updated");

  //       await deleteHorario(horario.id);
  //       await deleteFactor(factor.id);
  //     }, 30000);

  //     test("Non-existing Horario", async () => {
  //       const horario: Horario = {
  //         id: "HOR-123456789",
  //         nombre: "Test",
  //         multiplicador: "FDS-123456789",
  //         HoraInicio: {
  //           day: 1,
  //           month: 1,
  //           year: 2021,
  //           hour: 12,
  //           minute: 0,
  //           second: 0,
  //         },
  //         HoraFin: {
  //           day: 1,
  //           month: 1,
  //           year: 2021,
  //           hour: 12,
  //           minute: 0,
  //           second: 0,
  //         },
  //         ScheduleMonday: true,
  //         ScheduleTuesday: true,
  //         ScheduleWednesday: true,
  //         ScheduleThursday: true,
  //         ScheduleFriday: true,
  //         ScheduleSaturday: true,
  //         ScheduleSunday: true,
  //       };

  //       const result = await updateHorario(horario);
  //       expect(result).toBeNull();
  //     });
  //   });
  // });

  describe("Checks", () => {
    describe("Get Checks", () => {
      test("All Checks", async () => {
        expect(await getChecks()).not.toBeNull();
      });

      test("Existing Check", async () => {
        const factor: FactorDeSuelo = {
          id: "FDS-123456789",
          nombre: "Test",
          multiplicador: 1.5,
        };

        const fecha: Date = {
          day: 1,
          month: 1,
          year: 2021,
          hour: 12,
          minute: 0,
          second: 0,
        };

        const newUser: Usuario = {
          id: "PER-123456789",
          Nombre: "Test",
          Apellidos: "User",
          Foto: "https://via.placeholder.com/150",
          Password: "123456",
        };

        await deleteUser(newUser.id);
        await addUser(newUser);
        const check: Check = {
          id: "CHK-123456789",
          movimiento: 1,
          FechaYHora: fecha,
          userChecked: newUser.id,
        };
        // await addFactor(factor);
        // await addHorario(horario);

        await addCheck(check);

        const result = await getCheck(check.id);
        expect(result).not.toBeNull();

        await deleteUser(newUser.id);
        await deleteCheck(check.id);
        // await deleteHorario(horario.id);
        // await deleteFactor(factor.id);
      }, 30000);

      test("Non-Existing Check", async () => {
        const result = await getCheck("");
        expect(result).toBeNull();
      });
    });

    describe("Add Check", () => {
      test("Add check", async () => {
        const factor: FactorDeSuelo = {
          id: "FDS-123456789",
          nombre: "Test",
          multiplicador: 1.5,
        };

        // await deleteFactor(factor.id);
        // await addFactor(factor);

        const fecha: Date = {
          day: 1,
          month: 1,
          year: 2021,
          hour: 12,
          minute: 0,
          second: 0,
        };

        const horario: Horario = {
          id: "HOR-123456789",
          nombre: "Test",
          multiplicador: factor.id,
          HoraInicio: fecha,
          HoraFin: fecha,
          ScheduleMonday: true,
          ScheduleTuesday: true,
          ScheduleWednesday: true,
          ScheduleThursday: true,
          ScheduleFriday: true,
          ScheduleSaturday: true,
          ScheduleSunday: true,
        };

        // await deleteHorario(horario.id);
        // await addHorario(horario);

        const newUser: Usuario = {
          id: "PER-123456789",
          Nombre: "Test",
          Apellidos: "User",
          Foto: "https://via.placeholder.com/150",
          Password: "123456",
        };

        await deleteUser(newUser.id);
        await addUser(newUser);
        const check: Check = {
          id: "CHK-123456789",
          movimiento: 1,
          FechaYHora: fecha,
          userChecked: newUser.id,
        };

        await deleteCheck(check.id);
        await addCheck(check);

        const result = await getCheck(check.id);
        expect(result).not.toBeNull();
        await deleteUser(newUser.id);
        await deleteCheck(check.id);
      }, 30000);
    });

    describe("Delete Check", () => {
      test("Existing Check", async () => {
        const factor: FactorDeSuelo = {
          id: "FDS-123456789",
          nombre: "Test",
          multiplicador: 1.5,
        };

        // await deleteFactor(factor.id);
        // await addFactor(factor);

        const fecha: Date = {
          day: 1,
          month: 1,
          year: 2021,
          hour: 12,
          minute: 0,
          second: 0,
        };

        const horario: Horario = {
          id: "HOR-123456789",
          nombre: "Test",
          multiplicador: factor.id,
          HoraInicio: fecha,
          HoraFin: fecha,
          ScheduleMonday: true,
          ScheduleTuesday: true,
          ScheduleWednesday: true,
          ScheduleThursday: true,
          ScheduleFriday: true,
          ScheduleSaturday: true,
          ScheduleSunday: true,
        };

        const newUser: Usuario = {
          id: "PER-123456789",
          Nombre: "Test",
          Apellidos: "User",
          Foto: "https://via.placeholder.com/150",
          Password: "123456",
        };

        await deleteUser(newUser.id);
        await addUser(newUser);
        const check: Check = {
          id: "CHK-123456789",
          movimiento: 1,
          FechaYHora: fecha,
          userChecked: newUser.id,
        };

        // await addHorario(horario);
        await addCheck(check);

        await getCheck(check.id);
        await deleteCheck(check.id);
        await deleteUser(newUser.id);

        const result = await getCheck(check.id);
        expect(result).toBeNull();
        // await deleteHorario(horario.id);
        // await deleteFactor(factor.id);
      }, 30000);

      test("Non-existing Check", async () => {
        const result = await deleteCheck("CHK-123456789");
        expect(result).toBeNull();
      }, 50000);
    });

    describe("Update Check", () => {
      test("Existing Check", async () => {
        const factor: FactorDeSuelo = {
          id: "FDS-123456789",
          nombre: "Test",
          multiplicador: 1.5,
        };

        // await deleteFactor(factor.id);
        // await addFactor(factor);

        const fecha: Date = {
          day: 1,
          month: 1,
          year: 2021,
          hour: 12,
          minute: 0,
          second: 0,
        };

        const horario: Horario = {
          id: "HOR-123456789",
          nombre: "Test",
          multiplicador: factor.id,
          HoraInicio: fecha,
          HoraFin: fecha,
          ScheduleMonday: true,
          ScheduleTuesday: true,
          ScheduleWednesday: true,
          ScheduleThursday: true,
          ScheduleFriday: true,
          ScheduleSaturday: true,
          ScheduleSunday: true,
        };

        const newUser: Usuario = {
          id: "PER-123456789",
          Nombre: "Test",
          Apellidos: "User",
          Foto: "https://via.placeholder.com/150",
          Password: "123456",
        };

        await deleteUser(newUser.id);
        await addUser(newUser);
        const check: Check = {
          id: "CHK-123456789",
          movimiento: 1,
          FechaYHora: fecha,
          userChecked: newUser.id,
        };

        // await addHorario(horario);
        await addCheck(check);

        const updatedCheck: Check = {
          ...check,
          movimiento: 2,
        };

        await updateCheck(updatedCheck);

        console.log("Check", check);
        console.log("Updated Check", updatedCheck);
        const result = await getCheck(check.id);
        console.log("Result", result);
        expect(result).not.toBeNull();
        expect(result?.movimiento).toBe(2);

        await deleteCheck(check.id);
        await deleteUser(newUser.id);
        // await deleteHorario(horario.id);
        // await deleteFactor(factor.id);
      }, 30000);

      test("Non-existing Check", async () => {
        const fecha: Date = {
          day: 1,
          month: 1,
          year: 2021,
          hour: 12,
          minute: 0,
          second: 0,
        };

        const check: Check = {
          id: "CHK-123456789",
          movimiento: 1,
          FechaYHora: fecha,
          userChecked: "PER-123456789",
        };

        const result = await updateCheck(check);
        expect(result).toBeNull();
      }, 30000);
    });
  });
});
