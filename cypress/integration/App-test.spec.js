import React from "react";

describe("login", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.window()
      .its("firebase")
      .its("auth")
      .invoke("deleteAccount");
  });
  
  after(() => {
    cy.window()
      .its("firebase")
      .its("auth")
      .invoke("deleteAccount");
  });

  it("by phone number", () => {
    // The page contains all the necessary elements
    cy.contains(/social app/i);
    cy.contains(/sign in with phone number/i);
    cy.contains(/we'll send you an sms with a verification code/i);
    cy.get('[placeholder="Phone number"]')
      .should("have.value", "");
    cy.contains(/get code/i)
      .should("be.disabled");
    cy.get('[data-testid="Phone number"]')
      .children()
      .children('[data-testid="loader"]')
      .parent()
      .should("have.css", "opacity", "0");
    cy.contains(/enter a valid phone number/i)
      .should("have.css", "opacity", "0");
    cy.get('form[data-testid="SMS code"]')
      .parent('[data-testid="transform"]')
      .should("have.css", "transform", "matrix(0, 0, 0, 0, 0, 0)");
    cy.contains(/didn't get code/i)
      .parent('[data-testid="transform"]')
      .should("have.css", "transform", "matrix(0, 0, 0, 0, 0, 0)");
    cy.contains(/send again/i)
      .parents('[data-testid="transform"]')
      .should("have.css", "transform", "matrix(0, 0, 0, 0, 0, 0)");
      
    // The user types phone number
    cy.get('[placeholder="Phone number"]')
      .type("+7915")
      .should("have.value", "+7 915");
    cy.contains(/enter a valid phone number/i)
      .should("have.css", "opacity", "1");
    cy.contains(/get code/i)
      .should("be.disabled");
    cy.get('[placeholder="Phone number"]')
      .type("0000000")
      .should("have.value", "+7 915 000-00-00");
    cy.contains(/enter a valid phone number/i)
      .should("have.css", "opacity", "0");
    cy.contains(/get code/i)
      .should("be.enabled");
    
    // The user clicks "Get code" button
    cy.contains(/get code/i)
      .click();
    cy.get('[data-testid="Phone number"]')
      .children()
      .children('[data-testid="loader"]')
      .parent()
      .should("have.css", "opacity", "1");
    cy.get('[data-testid="Phone number"]')
      .children()
      .children('[data-testid="loader"]')
      .parent()
      .should("have.css", "opacity", "0");
    cy.contains(/get code/i)
      .should("be.disabled");
    cy.get('form[data-testid="SMS code"]')
      .parent('[data-testid="transform"]')
      .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.contains(/didn't get code/i)
      .parent('[data-testid="transform"]')
      .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.contains(/send again/i)
      .parents('[data-testid="transform"]')
      .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.get('[placeholder="SMS code"]')
      .should("have.value", "");
    cy.contains(/log in/i)
      .should("be.disabled");
    cy.contains(/bad verification code/i)
      .should("not.be.visible");
    
    // The user starts typing SMS code
    cy.get('[placeholder="SMS code"]')
      .type("1")
      .should("have.value", "1");
    
    // The user changes phone number
    cy.get('[placeholder="Phone number"]')
      .type("{backspace}")
      .should("have.value", "+7 915 000-00-0");
    cy.get('form[data-testid="SMS code"]')
      .parent('[data-testid="transform"]')
      .should("have.css", "transform", "matrix(0, 0, 0, 0, 0, 0)");
    cy.contains(/didn't get code/i)
      .parent('[data-testid="transform"]')
      .should("have.css", "transform", "matrix(0, 0, 0, 0, 0, 0)");
    cy.contains(/send again/i)
      .parents('[data-testid="transform"]')
      .should("have.css", "transform", "matrix(0, 0, 0, 0, 0, 0)");
    cy.get('[placeholder="Phone number"]')
      .type("0")
      .should("have.value", "+7 915 000-00-00");
    cy.contains(/get code/i)
      .should("be.disabled");
    cy.get('form[data-testid="SMS code"]')
      .parent('[data-testid="transform"]')
      .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.contains(/didn't get code/i)
      .parent('[data-testid="transform"]')
      .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.contains(/send again/i)
      .parents('[data-testid="transform"]')
      .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.get('[placeholder="SMS code"]')
      .should("have.value", "");
    
    // The user types wrong SMS code and clicks "Log in" button
    cy.get('[placeholder="SMS code"]')
      .type("1")
      .should("have.value", "1");
    cy.contains(/log in/i)
      .should("be.enabled")
      .click();
    cy.contains(/bad verification code/i)
      .should("have.css", "opacity", "1");
    
    // The user types correct SMS code and clicks "Log In" button
    cy.get('[placeholder="SMS code"]')
      .type("{backspace}")
      .type("123456")
      .should("have.value", "123456");
    cy.contains(/bad verification code/i)
      .should("not.be.visible");
    cy.contains(/log in/i)
      .should("be.enabled")
      .click();
    cy.url()
      .should("match", /profile/);
  });
  
  it("by Google", () => {
    cy.getGoogleToken()
      .then(token => {
        cy.window()
        .its("firebase")
        .its("auth")
        .invoke("loginWithGoogleWithToken", token);
      });
    cy.url()
      .should("match", /profile/);
  });
  
  it("by Github", () => {
    cy.getGithubToken()
      .then(token => {
        cy.window()
        .its("firebase")
        .its("auth")
        .invoke("loginWithGithubWithToken", token);
      });
    cy.url()
      .should("match", /profile/);
  });
});
