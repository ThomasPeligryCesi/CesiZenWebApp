import { describe, it, expect, vi } from "vitest";
import { adminMiddleware } from "../src/middleware/admin.middleware";

function createMockReqRes(role: string) {
  const req = {} as any;
  const res = {
    locals: { role },
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
  const next = vi.fn();
  return { req, res, next };
}

describe("adminMiddleware", () => {
  it("appelle next si le rôle est admin", () => {
    const { req, res, next } = createMockReqRes("admin");
    adminMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("retourne 403 si le rôle est user", () => {
    const { req, res, next } = createMockReqRes("user");
    adminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Access denied" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retourne 403 si le rôle est vide", () => {
    const { req, res, next } = createMockReqRes("");
    adminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
