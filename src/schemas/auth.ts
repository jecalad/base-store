import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({ message: "Email no válido" }),
    password: z.string().min(6, { message: "Contraseña mínima 6 caracteres" }),
});
