import { object, string } from "zod";

export const signInSchema = object({
  id: string({
    required_error: "El ID es requerido",
  })
    .min(1, "El ID es requerido")
    .max(100, "El ID no puede tener más de 100 caracteres"),
  password: string({
    required_error: "La contraseña es requerida",
  })
    .min(1, "La contraseña es requerida")
    .max(100, "La contraseña no puede tener más de 100 caracteres"),
});
