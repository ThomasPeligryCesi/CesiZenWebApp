import { describe, it, expect } from "vitest";
import { createExerciseSchema, updateExerciseSchema } from "../src/validators/exercise.validator";

describe("createExerciseSchema", () => {
  it("accepte un exercice valide", () => {
    const result = createExerciseSchema.safeParse({
      name: "Respiration 4-7-8",
      duration: 180,
      level: 1,
      description: "Exercice de relaxation",
      steps: [4, 7, 8],
    });
    expect(result.success).toBe(true);
  });

  it("accepte les steps en string JSON", () => {
    const result = createExerciseSchema.safeParse({
      name: "Respiration",
      duration: 60,
      level: 1,
      description: "Description",
      steps: "[4,4,4]",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.steps).toEqual([4, 4, 4]);
    }
  });

  it("accepte avec benefits optionnel", () => {
    const result = createExerciseSchema.safeParse({
      name: "Exercice",
      duration: 60,
      level: 1,
      description: "Desc",
      steps: [4, 6],
      benefits: "Réduit le stress",
    });
    expect(result.success).toBe(true);
  });

  it("refuse un nom manquant", () => {
    const result = createExerciseSchema.safeParse({
      duration: 60,
      level: 1,
      description: "Desc",
      steps: [4, 4, 4],
    });
    expect(result.success).toBe(false);
  });

  it("refuse des steps manquants", () => {
    const result = createExerciseSchema.safeParse({
      name: "Exercice",
      duration: 60,
      level: 1,
      description: "Desc",
    });
    expect(result.success).toBe(false);
  });

  it("strip les balises HTML du nom", () => {
    const result = createExerciseSchema.safeParse({
      name: "<b>Exercice</b>",
      duration: 60,
      level: 1,
      description: "Desc",
      steps: [4, 4],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Exercice");
    }
  });

  it("coerce duration et level en nombres", () => {
    const result = createExerciseSchema.safeParse({
      name: "Exercice",
      duration: "120",
      level: "2",
      description: "Desc",
      steps: [4, 4],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.duration).toBe(120);
      expect(result.data.level).toBe(2);
    }
  });
});

describe("updateExerciseSchema", () => {
  it("accepte une mise à jour partielle", () => {
    const result = updateExerciseSchema.safeParse({
      name: "Nouveau nom",
    });
    expect(result.success).toBe(true);
  });

  it("accepte un objet vide", () => {
    const result = updateExerciseSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
