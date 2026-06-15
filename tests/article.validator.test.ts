import { describe, it, expect } from "vitest";
import { createArticleSchema, updateArticleSchema } from "../src/validators/article.validator";

describe("createArticleSchema", () => {
  it("accepte un article valide", () => {
    const result = createArticleSchema.safeParse({
      title: "Mon article",
      content: "Contenu de l'article",
      status: 1,
      readingTime: 5,
    });
    expect(result.success).toBe(true);
  });

  it("accepte un article avec imgUrl", () => {
    const result = createArticleSchema.safeParse({
      title: "Titre",
      content: "Contenu",
      imgUrl: "https://example.com/image.png",
      status: 1,
      readingTime: 3,
    });
    expect(result.success).toBe(true);
  });

  it("refuse un titre manquant", () => {
    const result = createArticleSchema.safeParse({
      content: "Contenu",
      status: 1,
      readingTime: 5,
    });
    expect(result.success).toBe(false);
  });

  it("refuse un contenu manquant", () => {
    const result = createArticleSchema.safeParse({
      title: "Titre",
      status: 1,
      readingTime: 5,
    });
    expect(result.success).toBe(false);
  });

  it("strip les balises HTML du titre", () => {
    const result = createArticleSchema.safeParse({
      title: "<script>alert('xss')</script>Titre",
      content: "Contenu",
      status: 1,
      readingTime: 5,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("alert('xss')Titre");
    }
  });

  it("refuse une imgUrl javascript:", () => {
    const result = createArticleSchema.safeParse({
      title: "Titre",
      content: "Contenu",
      imgUrl: "javascript:alert(1)",
      status: 1,
      readingTime: 5,
    });
    expect(result.success).toBe(false);
  });

  it("refuse un titre de plus de 255 caractères", () => {
    const result = createArticleSchema.safeParse({
      title: "a".repeat(256),
      content: "Contenu",
      status: 1,
      readingTime: 5,
    });
    expect(result.success).toBe(false);
  });

  it("coerce le status en nombre", () => {
    const result = createArticleSchema.safeParse({
      title: "Titre",
      content: "Contenu",
      status: "1",
      readingTime: "5",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe(1);
      expect(result.data.readingTime).toBe(5);
    }
  });
});

describe("updateArticleSchema", () => {
  it("accepte une mise à jour partielle", () => {
    const result = updateArticleSchema.safeParse({
      title: "Nouveau titre",
    });
    expect(result.success).toBe(true);
  });

  it("accepte un objet vide", () => {
    const result = updateArticleSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
