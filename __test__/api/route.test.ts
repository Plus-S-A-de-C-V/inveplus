// import "@testing-library/jest-dom";
// require('dotenv').config();
require("dotenv").config({ path: ".env.local" });
import { getUsers, getUser, addUser, deleteUser, updateUser } from "@/lib/db";
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
import { Product, Usuario, Supplier } from "@/lib/definitions";

describe("[LIB]", () => {
  describe("Users", () => {
    describe("Get Users", () => {
      test("All users", async () => {
        expect(await getUsers()).not.toBeNull();
      });

      test("Existing User", async () => {
        const result = await getUser("PER-e9ZStNvTpH");
        expect(result).not.toBeNull();
        expect(result?.id).not.toBeUndefined();
        expect(result?.Nombre).not.toBeUndefined();
        expect(result?.Apellidos).not.toBeUndefined();
        expect(result?.Foto).not.toBeUndefined();
        expect(result?.Password).not.toBeUndefined();
        expect(result?.InformacionMedica).toBeUndefined();
        expect(result?.InformacionPersonal).toBeUndefined();
        expect(result?.DocumentosPersonales).toBeUndefined();
        expect(result?.Historial).toBeUndefined();
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
        await addUser(newUser);

        const result = await getUser(newUser.id);
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
});
