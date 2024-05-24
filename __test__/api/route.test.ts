// import "@testing-library/jest-dom";
// require('dotenv').config();
require("dotenv").config({ path: ".env.local" });
import { getUsers, getUser, addUser, deleteUser, updateUser } from "@/lib/db";
import { Usuario } from "@/lib/definitions";

describe("[LIB] Users", () => {
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
