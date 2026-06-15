import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock jsonwebtoken avant l'import du middleware
vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

import jwt from "jsonwebtoken";
import { authMiddleware } from "../src/middleware/auth.middleware";

function createMockReqRes(authHeader?: string) {
  const req = {
    headers: { authorization: authHeader },
  } as any;
  const res = {
    locals: {} as Record<string, any>,
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
  const next = vi.fn();
  return { req, res, next };
}

describe("authMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("retourne 401 si aucun header Authorization", () => {
    const { req, res, next } = createMockReqRes(undefined);
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retourne 401 si le header est vide après Bearer", () => {
    const { req, res, next } = createMockReqRes("Bearer ");
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("appelle next et définit locals avec un token valide", () => {
    const payload = { userId: "user-123", role: "admin" };
    (jwt.verify as any).mockReturnValue(payload);

    const { req, res, next } = createMockReqRes("Bearer valid-token");
    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
    expect(res.locals.userId).toBe("user-123");
    expect(res.locals.role).toBe("admin");
    expect(next).toHaveBeenCalled();
  });

  it("retourne 401 si jwt.verify lance une erreur", () => {
    (jwt.verify as any).mockImplementation(() => {
      throw new Error("invalid token");
    });

    const { req, res, next } = createMockReqRes("Bearer bad-token");
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retourne 401 si jwt.verify retourne un string", () => {
    (jwt.verify as any).mockReturnValue("some-string");

    const { req, res, next } = createMockReqRes("Bearer weird-token");
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid token",
      success: false,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
