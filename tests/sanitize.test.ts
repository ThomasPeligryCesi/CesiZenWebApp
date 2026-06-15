import { describe, it, expect } from "vitest";
import { stripHtml, isSafeUrl } from "../src/utils/sanitize";

describe("stripHtml", () => {
  it("retire les balises HTML simples", () => {
    expect(stripHtml("<p>Hello</p>")).toBe("Hello");
  });

  it("retire les balises imbriquées", () => {
    expect(stripHtml("<div><b>texte</b></div>")).toBe("texte");
  });

  it("retire les balises script", () => {
    expect(stripHtml('<script>alert("xss")</script>')).toBe('alert("xss")');
  });

  it("ne modifie pas un texte sans HTML", () => {
    expect(stripHtml("Texte normal")).toBe("Texte normal");
  });

  it("gère une chaîne vide", () => {
    expect(stripHtml("")).toBe("");
  });

  it("retire les attributs des balises", () => {
    expect(stripHtml('<a href="http://evil.com">lien</a>')).toBe("lien");
  });
});

describe("isSafeUrl", () => {
  it("autorise une URL http", () => {
    expect(isSafeUrl("http://example.com")).toBe(true);
  });

  it("autorise une URL https", () => {
    expect(isSafeUrl("https://example.com/image.png")).toBe(true);
  });

  it("refuse javascript:", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
  });

  it("refuse JavaScript: (casse mixte)", () => {
    expect(isSafeUrl("JavaScript:alert(1)")).toBe(false);
  });

  it("refuse data:", () => {
    expect(isSafeUrl("data:text/html,<h1>XSS</h1>")).toBe(false);
  });

  it("refuse vbscript:", () => {
    expect(isSafeUrl("vbscript:MsgBox")).toBe(false);
  });

  it("refuse avec espaces avant le protocole interdit", () => {
    expect(isSafeUrl("  javascript:alert(1)")).toBe(false);
  });

  it("autorise un chemin relatif", () => {
    expect(isSafeUrl("/uploads/image.png")).toBe(true);
  });
});
