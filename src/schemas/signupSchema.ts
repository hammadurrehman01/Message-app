import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be no more 20 characters")
  .regex(/^[a-zA-Z0-9_]$/);

export const emailValidation = z
  .string()
  .email({ message: "Invalid email address" })
  .regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);

export const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters");

export const signupSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});