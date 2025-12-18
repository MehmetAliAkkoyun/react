describe("IT1 - Pizza Sipariş Formu", () => {
 beforeEach(() => {
  cy.visit("http://localhost:5173/");
  cy.get('[data-cy="go-order"]').should("be.visible").click();
});




  it("inputa bir metin giren test", () => {
    cy.get('input[placeholder="En az 3 karakter"]')
      .type("Mali")
      .should("have.value", "Mali");
  });

  it("birden fazla malzeme seçilebilen bir test", () => {
    const toppings = ["Pepperoni", "Sosis", "Mısır", "Ananas"];

    toppings.forEach((item) => {
      cy.contains(".checkRow", item)
        .find('input[type="checkbox"]')
        .check()
        .should("be.checked");
    });

    
    cy.get('.toppingsGrid input[type="checkbox"]:checked')
      .should("have.length.at.least", 4);
  });

  it("formu gönderen bir test", () => {
   
    cy.intercept("POST", "https://reqres.in/api/pizza", (req) => {
     
      expect(req.headers).to.have.property("x-api-key", "reqres-free-v1");

      req.reply({
        statusCode: 201,
        body: {
          id: "pizza-123",
          createdAt: "2025-01-01T00:00:00.000Z",
          ...req.body,
        },
      });
    }).as("postPizza");

    
    cy.get('input[placeholder="En az 3 karakter"]').type("Mali");

    cy.contains(".radioRow", "Orta")
      .find('input[type="radio"]')
      .check();

    cy.get("select.selectInput").select("İnce");

    ["Pepperoni", "Sosis", "Mısır", "Ananas"].forEach((item) => {
      cy.contains(".checkRow", item)
        .find('input[type="checkbox"]')
        .check();
    });

    cy.get('input[placeholder="Siparişine eklemek istediğin bir not var mı?"]')
      .type("Bol acı olsun");

  
    cy.get("button.orderBtn")
      .should("not.be.disabled")
      .click();

  
    cy.wait("@postPizza");

   
    cy.contains("TEBRİKLER").should("be.visible");
    cy.contains("SİPARİŞİNİZ ALINDI").should("be.visible");
  });
});
