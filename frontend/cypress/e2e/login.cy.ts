describe("Page de login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("affiche le formulaire de connexion", () => {
    cy.contains("h1", "Backoffice CesiZen");
    cy.get("input[type=email]").should("be.visible");
    cy.get("input[type=password]").should("be.visible");
    cy.get("button[type=submit]").should("be.visible");
  });

  it("affiche une erreur avec des identifiants invalides", () => {
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 401,
      body: { error: "Identifiants inconnus" },
    }).as("loginFail");

    cy.get("input[type=email]").type("inconnu@test.com");
    cy.get("input[type=password]").type("mauvaismdp");
    cy.get("button[type=submit]").click();

    cy.wait("@loginFail");
    cy.contains("Identifiants inconnus").should("be.visible");
  });

  it("redirige vers /login si non connecté", () => {
    cy.visit("/articles");
    cy.url().should("include", "/login");
  });
});
