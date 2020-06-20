import React from "react";

describe("profile", () => {
  
  before(() => {
    cy.login();
  });
  
  after(() => {
    cy.logout();
  });
  
  beforeEach(() => {
    cy.init();
  });
  
  it("changes username", () => {
    cy.get('[placeholder="Username"]').as("username");
    cy.get('[data-testid="Username"]')
      .children()
      .children('[data-testid="loader"]')
      .parent().as("usernameLoader");
    
    // Username form exists
    cy.get("@username").should("have.value", "");
    cy.contains(/^saved$/i).should("be.disabled");
    cy.contains(/^save&/i).should("not.exist");
    cy.contains(/to use the site you must add a username/i);
    cy.contains("a", /feed/i).should("not.exist");
    cy.contains("a", /profile/i).should("not.exist");
    
    // User types username that has too small length
    cy.get("@username").type("we").should("have.value", "@we");
    cy.contains(/^save$/i).should("be.disabled");
    cy.contains(/^saved&/i).should("not.exist");
    
    // User types more letters
    cy.get("@username").type("lcome").should("have.value", "@welcome");
    cy.contains(/^save$/i).should("be.enabled")
    
    // User clicks the button
    cy.contains(/^save$/i).click();
    cy.get("@usernameLoader").should("have.css", "opacity", "1");
    cy.get("@usernameLoader").should("have.css", "opacity", "0");
    cy.nullifyUsername();
    cy.contains(/^save$/i).should("not.exist");
    cy.contains(/^saved$/i).should("be.disabled");
    cy.contains(/@welcome/);
    cy.contains(/to use the site you must add a username/i).should("not.exist");
    cy.contains("a", /feed/i);
    cy.contains("a", /profile/i);
  });
  
  it("managing providers", () => {
    cy.get('[data-testid="phone-button"]').as("phoneButton");
    cy.get('[data-testid="google.com-button"]').as("googleButton");
    cy.get('[data-testid="github.com-button"]').as("githubButton");
    cy.get("@phoneButton")
      .siblings()
      .children('[data-testid="loader"]').as("phoneLoader");
    cy.get("@googleButton")
      .siblings()
      .children('[data-testid="loader"]').as("googleLoader");
    cy.get("@githubButton")
      .siblings()
      .children('[data-testid="loader"]').as("githubLoader");
    
    // All providers are linked
    cy.contains("+7 915 000-00-00");
    cy.get("@phoneButton").contains(/^unlink$/i);
    cy.get("@phoneLoader").parent().should("have.css", "opacity", "0");
    cy.get("@googleButton").contains(/^unlink$/i);
    cy.get("@googleLoader").parent().should("have.css", "opacity", "0");
    cy.get("@githubButton").contains(/^unlink$/i);
    cy.get("@githubLoader").parent().should("have.css", "opacity", "0");
    cy.contains(/not linked/i).should("not.exist");
    
    // Unlink phone
    cy.get("@phoneButton").click();
    cy.get("@phoneLoader").should("have.css", "opacity", "1");
    cy.get("@phoneLoader").should("not.exist");
    cy.get("@phoneButton").siblings(/not linked/i);
    cy.get("@phoneButton").contains(/^link$/i);
    
    // Unlink Github
    cy.get("@githubButton").click();
    cy.get("@githubLoader").should("have.css", "opacity", "1");
    cy.get("@githubLoader").should("not.exist");
    cy.get("@githubButton").siblings(/not linked/i);
    cy.get("@githubButton").contains(/^link$/i);
    
    // Try to unlink Google
    cy.get("@googleButton").click();
    cy.contains(/an error occurred/i);
    cy.contains(/you cannot unlink the last login method/i);
    cy.contains(/close/i).click();
    
    // Link phone
    cy.get("@phoneButton").click();
    cy.contains(/link phone number/i);
    cy.get('[placeholder="Phone number"]')
      .type("79150000000")
      .should("have.value", "+7 915 000-00-00");
    cy.contains(/get code/i).should("be.enabled").click();
    cy.get('[placeholder="SMS code"]')
      .type("123456")
      .should("have.value", "123456");
    cy.get('[placeholder="SMS code"]')
      .siblings()
      .contains(/link/i)
      .should("be.enabled")
      .click();
    cy.get("@phoneButton").contains(/^unlink$/i);
    
    // Unlink Google
    cy.get("@googleButton").click();
    cy.get("@googleLoader").should("have.css", "opacity", "1");
    cy.get("@googleLoader").should("not.exist");
    cy.get("@googleButton").siblings(/not linked/i);
    cy.get("@googleButton").contains(/^link$/i);
    
    // Change phone
    cy.get("@phoneButton").contains(/^change$/i);
    cy.get("@phoneButton").click();
    cy.contains(/change phone number/i);
    cy.get('[placeholder="Phone number"]')
      .type("79150000000")
      .should("have.value", "+7 915 000-00-00");
    cy.contains(/get code/i).should("be.enabled").click();
    cy.get('[placeholder="SMS code"]').type("123456").should("have.value", "123456");
    cy.get('[placeholder="SMS code"]')
      .siblings()
      .contains(/change/i)
      .should("be.enabled")
      .click();
    cy.get("@phoneButton").contains(/^change$/i);
    cy.contains(/change phone number/i).should("not.exist");
    
    // because @auth no longer refers to firebase.auth
    cy.window().its("firebase").its("auth").as("auth");
    
    // Link Google
    cy.stubAndCheck(
      () => cy.get("@googleButton").click(),
      "@auth",
      "linkProvider",
      "google.com"
    );
    
    cy.linkGoogle();
    cy.refresh();
    cy.get("@googleButton").contains(/^unlink$/i);
    
    // Link Github
    cy.stubAndCheck(
      () => cy.get("@githubButton").click(),
      "@auth",
      "linkProvider",
      "github.com"
    );
    
    cy.linkGithub();
    cy.refresh();
    cy.get("@githubButton").contains(/^unlink$/i);
  });
  
  it("deleting account", () => {
    cy.contains(/delete account/i).click();
    cy.contains(/deleting account/i);
    cy.contains(/are you sure you want to delete your account/i);
    cy.stubAndCheck(
      () => cy.contains(/yes/i).click(),
      "@auth",
      "deleteAccount"
    );
  });
  
  it("error while trying to change username", () => {
    cy.get('[placeholder="Username"]').as("username");
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "updateUsername")
          .rejects(new Error("couldntUpdateUsername"));
      });
    
    cy.get("@username").type("invalid username");
    cy.contains(/^save$/i).should("be.enabled").click();
    cy.get("@auth").its("updateUsername").should("be.called");
    cy.contains(/couldn't update username/i).should("have.css", "opacity", "1");
  });
  
  it("error while trying to unlink provider", () => {
    cy.get('[data-testid="google.com-button"]').as("googleButton");
    
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "unlinkProvider")
          .rejects(new Error("couldntUnlink"));
      });
      
    cy.get("@googleButton").click();
    cy.get("@auth").its("unlinkProvider").should("be.calledWith", "google.com");
    cy.contains(/an error occurred/i);
    cy.contains(/couldn't unlink "google\.com"/i);
    cy.contains(/close/i).click();
  });
  
  it("error while trying to link provider", () => {
    cy.get('[data-testid="google.com-button"]').as("googleButton");
    cy.stubAndCheck(
      () => cy.get("@googleButton").click(),
      "@auth",
      "unlinkProvider",
      "google.com"
    );
    cy.refresh();
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "getRedirectResult")
          .resolves({ 
            outcome: "failure", 
            cause: "emailAlreadyInUse", 
            providerId: "google.com" 
          });
      });
    
    cy.contains(/an error occurred/i);
    cy.contains(/couldn't link to google\.com/i);
    cy.contains(/the email address is already in use by another account/i);
    cy.contains(/close/i).click();
    cy.contains(/an error occurred/i).should("not.exist");
  });
  
  it("error while trying to link phone number", () => {
    let linkPhoneStub;
    cy.get('[data-testid="phone-button"]').as("phoneButton");
    cy.get("@phoneButton").click();
    cy.get("@phoneButton").contains(/^link$/i).click();
    cy.contains(/link phone number/i);
    cy.get('[placeholder="Phone number"]')
      .type("79150000000")
      .should("have.value", "+7 915 000-00-00");
    cy.contains(/get code/i).should("be.enabled").click();
    cy.get('[placeholder="SMS code"]')
      .type("123456")
      .should("have.value", "123456");
    cy.window()
      .its("firebase")
      .its("auth")
      .then(auth => {
        linkPhoneStub = cy.stub(auth, "linkPhoneNumber")
          .rejects(new Error("couldntLinkThisNumber"));
      });
    cy.get('[placeholder="SMS code"]')
      .siblings()
      .contains(/link/i)
      .should("be.enabled")
      .click();
    cy.window()
      .its("firebase")
      .its("auth")
      .its("linkPhoneNumber")
      .should("be.calledWith", "123456")
      .then(() => linkPhoneStub.restore());
    cy.contains(/couldn't link this phone number/i)
      .should("have.css", "opacity", "1");
    cy.get('[placeholder="SMS code"]')
      .type("{backspace}6")
      .should("have.value", "123456");
    cy.get('[placeholder="SMS code"]')
      .siblings()
      .contains(/link/i)
      .should("be.enabled")
      .click();
    cy.get("@phoneButton").contains(/^unlink$/i);
  });
  
  it("error while trying to change phone number", () => {
    cy.get('[data-testid="phone-button"]').as("phoneButton");
    cy.get('[data-testid="google.com-button"]').as("googleButton");
    cy.get('[data-testid="github.com-button"]').as("githubButton");
    
    // Unlink Github
    cy.get("@githubButton").contains(/^unlink$/i).click();
    cy.get("@githubButton").siblings(/not linked/i);
    cy.get("@githubButton").contains(/^link$/i);
    
    // Unlink Google
    cy.get("@googleButton").contains(/^unlink$/i).click();
    cy.get("@googleButton").siblings(/not linked/i);
    cy.get("@googleButton").contains(/^link$/i);
    
    // Trying to change phone number
    cy.get("@phoneButton").contains(/^change$/i).click();
    cy.contains(/change phone number/i);
    cy.get('[placeholder="Phone number"]')
      .type("79150000000")
      .should("have.value", "+7 915 000-00-00");
    cy.contains(/get code/i).should("be.enabled").click();
    cy.get('[placeholder="SMS code"]')
      .type("123456")
      .should("have.value", "123456");
    cy.window()
      .its("firebase")
      .its("auth")
      .then(auth => {
        cy.stub(auth, "changePhoneNumber")
          .rejects(new Error("couldntChangePhoneNumber"));
      });
    cy.get('[placeholder="SMS code"]')
      .siblings()
      .contains(/change/i)
      .should("be.enabled")
      .click();
    cy.window()
      .its("firebase")
      .its("auth")
      .its("changePhoneNumber")
      .should("be.calledWith", "123456");
    cy.contains(/couldn't change phone number/i)
      .should("have.css", "opacity", "1");
    cy.contains(/cancel/i).click();
    cy.contains(/change phone number/i).should("not.exist");
    
    cy.window().its("firebase").its("auth").as("auth");
    
    // Link Google
    cy.stubAndCheck(
      () => cy.get("@googleButton").click(),
      "@auth",
      "linkProvider",
      "google.com"
    );
    cy.linkGoogle();
    cy.refresh();
    cy.get("@googleButton").contains(/^unlink$/i);
    
    // Link Github
    cy.stubAndCheck(
      () => cy.get("@githubButton").click(),
      "@auth",
      "linkProvider",
      "github.com"
    );
    cy.linkGithub();
    cy.refresh();
    cy.get("@githubButton").contains(/^unlink$/i);
  });
  
  it("error couldn't delete account while deleting account", () => {
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "deleteAccount")
          .rejects(new Error("couldntDeleteAccount"));
      });
    
    cy.contains(/delete account/i).click();
    cy.contains(/deleting account/i);
    cy.contains(/are you sure you want to delete your account/i);
    cy.contains(/yes/i).click();
    cy.get("@auth").its("deleteAccount").should("be.called");
    cy.contains(/an error occurred/i);
    cy.contains(/couldn't delete account/i);
    cy.contains(/close/i).click();
  });
  
  it("requires recent login while deleting account with linked phone number", () => {
    let checkNumberStub;
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "deleteAccount")
          .rejects(new Error("Requires recent login"));
      });
    
    cy.contains(/delete account/i).click();
    cy.contains(/deleting account/i);
    cy.contains(/are you sure you want to delete your account/i);
    cy.contains(/yes/i).click();
    cy.get("@auth")
      .its("deleteAccount")
      .should("be.called");
    
    // Trying to check phone number
    cy.contains(/check phone number/i);
    cy.window().its("firebase").its("auth").as("auth");
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "deleteAccount").resolves();
      });
    cy.get("@auth")
      .then(auth => {
        checkNumberStub = cy.stub(auth, "reauthenticate")
          .rejects(new Error("couldntCheckPhoneNumber"));
      });
    cy.get('[placeholder="Phone number"]')
      .should("have.value", "+7 915 000-00-00")
      .should("be.disabled");
    cy.contains(/get code/i).should("be.enabled").click();
    cy.get('[placeholder="SMS code"]')
      .type("123456")
      .should("have.value", "123456");
    cy.get('[placeholder="SMS code"]')
      .siblings()
      .contains(/check/i)
      .should("be.enabled")
      .click();
    cy.get("@auth")
      .its("reauthenticate")
      .should("be.calledWith", "123456")
      .then(() => {
        checkNumberStub.resolves();
      });
    cy.contains(/couldn't check phone number/i)
      .should("have.css", "opacity", "1");
    
    // Successful checking
    cy.get('[placeholder="SMS code"]')
      .type("{backspace}6")
      .should("have.value", "123456");
    cy.get('[placeholder="SMS code"]')
      .siblings()
      .contains(/check/i)
      .should("be.enabled")
      .click();
    cy.get("@auth")
      .its("reauthenticate")
      .should("be.calledWith", "123456");
    cy.contains(/check phone number/i).should("not.exist");
  });
  
  it("requires recent login while deleting account with not linked phone number", () => {
    cy.get('[data-testid="phone-button"]').as("phoneButton");
    
    // Unlink phone
    cy.get("@phoneButton").click();
    cy.get("@phoneButton").siblings(/not linked/i);
    cy.get("@phoneButton").contains(/^link$/i);
    
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "deleteAccount")
          .rejects(new Error("Requires recent login"));
      });
    
    cy.contains(/delete account/i).click();
    cy.contains(/deleting account/i);
    cy.contains(/are you sure you want to delete your account/i);
    cy.contains(/yes/i).click();
    cy.get("@auth")
      .its("deleteAccount")
      .should("be.called");
    
    cy.contains(/an error occurred/i);
    cy.contains(/you need to link a phone number to delete the account/i);
    cy.contains(/close/i).click();
    
    // Link phone
    cy.get("@phoneButton").click();
    cy.contains(/link phone number/i);
    cy.get('[placeholder="Phone number"]')
      .type("79150000000")
      .should("have.value", "+7 915 000-00-00");
    cy.contains(/get code/i).should("be.enabled").click();
    cy.get('[placeholder="SMS code"]')
      .type("123456")
      .should("have.value", "123456");
    cy.get('[placeholder="SMS code"]')
      .siblings()
      .contains(/link/i)
      .should("be.enabled")
      .click();
    cy.get("@phoneButton").contains(/^unlink$/i);
    cy.contains(/link phone number/i).should("not.exist");
    
    // Successful deleting account
    cy.window().its("firebase").its("auth").as("auth");
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "deleteAccount").resolves();
      });
    
    cy.contains(/delete account/i).click();
    cy.get("@auth")
      .its("deleteAccount")
      .should("be.called");
  });
});
