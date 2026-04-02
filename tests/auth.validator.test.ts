import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../src/validators/auth.validator";

describe("registerSchema", () => {
  it("accepte un email et mot de passe valides", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "Password1!",
    });
    expect(result.success).toBe(true);
  });

  it("refuse un email invalide", () => {
    const result = registerSchema.safeParse({
      email: "invalid",
      password: "Password1!",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe trop court", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "Ab1!",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe sans majuscule", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password1!",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe sans minuscule", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "PASSWORD1!",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe sans chiffre", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "Password!",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe sans caractère spécial", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepte un email et mot de passe valides", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "anypassword",
    });
    expect(result.success).toBe(true);
  });

  it("refuse un mot de passe vide", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un email invalide", () => {
    const result = loginSchema.safeParse({
      email: "notanemail",
      password: "password",
    });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepte un email valide", () => {
    const result = forgotPasswordSchema.safeParse({ email: "user@test.com" });
    expect(result.success).toBe(true);
  });

  it("refuse un email invalide", () => {
    const result = forgotPasswordSchema.safeParse({ email: "nope" });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("accepte un token et mot de passe valides", () => {
    const result = resetPasswordSchema.safeParse({
      token: "abc123",
      password: "NewPass1!",
    });
    expect(result.success).toBe(true);
  });

  it("refuse un token vide", () => {
    const result = resetPasswordSchema.safeParse({
      token: "",
      password: "NewPass1!",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe faible", () => {
    const result = resetPasswordSchema.safeParse({
      token: "abc123",
      password: "weak",
    });
    expect(result.success).toBe(false);
  });
});
