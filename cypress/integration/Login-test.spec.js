import React from "react";

describe("login", () => {
  beforeEach(() => {
    cy.init();
    cy.url().should("match", /login|profile/);
    cy.logout();
  });
  
  it("by phone number", () => {
    cy.get('[placeholder="Phone number"]').as("phone");
    cy.get('[data-testid="Phone number"]')
      .children()
      .children('[data-testid="loader"]')
      .parent().as("phoneLoader");
    cy.get('form[data-testid="SMS code"]')
      .parent('[data-testid="transform"]').as("smsFormWrapper");
    cy.contains(/didn't get code/i)
      .parent('[data-testid="transform"]').as("didntGetCodeWrapper");
    cy.contains(/send again/i)
      .parents('[data-testid="transform"]').as("sendAgainWrapper");
    cy.get('[placeholder="SMS code"]').as("sms");
    
    // The page contains all the necessary elements
    cy.contains(/social app/i);
    cy.contains(/sign in with phone number/i);
    cy.contains(/we'll send you an sms with a verification code/i);
    cy.get("@phone").should("have.value", "");
    cy.contains(/get code/i).should("be.disabled");
    cy.get("@phoneLoader").should("have.css", "opacity", "0");
    cy.contains(/enter a valid phone number/i)
      .should("have.css", "opacity", "0");
    cy.get("@smsFormWrapper")
      .should("have.css", "transform", "matrix(0, 0, 0, 0, 0, 0)");
    cy.get("@didntGetCodeWrapper")
      .should("have.css", "transform", "matrix(0, 0, 0, 0, 0, 0)");
    cy.get("@sendAgainWrapper")
      .should("have.css", "transform", "matrix(0, 0, 0, 0, 0, 0)");
      
    // The user types phone number
    cy.get('[placeholder="Phone number"]')
      .type("7915")
      .should("have.value", "+7 915");
    cy.contains(/enter a valid phone number/i)
      .should("have.css", "opacity", "1");
    cy.contains(/get code/i)
      .should("be.disabled");
    cy.get("@phone")
      .type("0000000")
      .should("have.value", "+7 915 000-00-00");
    cy.contains(/enter a valid phone number/i)
      .should("have.css", "opacity", "0");
    cy.contains(/get code/i).should("be.enabled");
    
    // The user clicks "Get code" button
    cy.contains(/get code/i).click();
    cy.get("@phoneLoader").should("have.css", "opacity", "1");
    cy.get("@phoneLoader").should("have.css", "opacity", "0");
    cy.contains(/get code/i).should("be.disabled");
    cy.get("@smsFormWrapper")
      .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.get("@didntGetCodeWrapper")
      .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.get("@sendAgainWrapper")
      .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.get("@sms").should("have.value", "");
    cy.contains(/log in/i).should("be.disabled");
    cy.contains(/bad verification code/i).should("not.be.visible");
    
    // The user starts typing SMS code
    cy.get("@sms").type("1").should("have.value", "1");
    
    // The user changes phone number
    cy.get("@phone")
      .type("{backspace}")
      .should("have.value", "+7 915 000-00-0");
    cy.get("@smsFormWrapper")
      .should("have.css", "transform", "matrix(0, 0, 0, 0, 0, 0)");
    cy.get("@didntGetCodeWrapper")
      .should("have.css", "transform", "matrix(0, 0, 0, 0, 0, 0)");
    cy.get("@sendAgainWrapper")
      .should("have.css", "transform", "matrix(0, 0, 0, 0, 0, 0)");
    cy.get("@phone")
      .type("0")
      .should("have.value", "+7 915 000-00-00");
    cy.contains(/get code/i).should("be.disabled");
    cy.get("@smsFormWrapper")
      .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.get("@didntGetCodeWrapper")
      .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.get("@sendAgainWrapper")
      .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.get("@sms").should("have.value", "");
    
    // The user types wrong SMS code and clicks "Log in" button
    cy.get("@sms").type("1").should("have.value", "1");
    cy.contains(/log in/i).should("be.enabled").click();
    cy.contains(/bad verification code/i).should("have.css", "opacity", "1");
    
    // The user types correct SMS code and clicks "Log In" button
    cy.get("@sms")
      .type("{backspace}")
      .type("123456")
      .should("have.value", "123456");
    cy.contains(/bad verification code/i).should("not.be.visible");
    cy.contains(/log in/i).should("be.enabled").click();
    cy.url().should("match", /profile/);
  });
  
  it("by Google", () => {
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "loginWithGoogle");
      });
    cy.contains(/sign in with google/i).click();
    cy.get("@auth").its("loginWithGoogle").should("be.called");
    cy.loginWithGoogle();
    cy.url().should("match", /profile/);
  });
  
  it("by Github", () => {
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "loginWithGithub");
      });
    cy.contains(/sign in with github/i).click();
    cy.get("@auth").its("loginWithGithub").should("be.called");
    cy.loginWithGoogle();
    cy.url().should("match", /profile/);
  });
  
  it("mocking that phone number is invalid", () => {
    cy.get('[placeholder="Phone number"]').as("phone");
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "sendSMSCode").rejects(new Error("phoneNumberIsNotValid"));
      });
    cy.get("@phone")
      .type("79150000001")
      .should("have.value", "+7 915 000-00-01");
    cy.contains(/get code/i).should("be.enabled").click();
    cy.get("@auth").its("sendSMSCode").should("be.called");
    cy.contains(/phone number is not valid/i).should("have.css", "opacity", "1");
    cy.contains(/get code/i).should("be.disabled");
  });
  
  it("error while sending sms code", () => {
    cy.get('[placeholder="Phone number"]').as("phone");
    
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "sendSMSCode").rejects(new Error("errorSendingSMSCode"));
      });
    cy.get("@phone")
      .type("79150000002")
      .should("have.value", "+7 915 000-00-02");
    cy.contains(/get code/i).should("be.enabled").click();
    cy.get("@auth").its("sendSMSCode").should("be.called");
    cy.contains(/error sending sms code/i).should("have.css", "opacity", "1");
    cy.contains(/get code/i).should("be.disabled");
  });
  
  it("error while confirming sms code", () => {
    cy.get('[placeholder="Phone number"]').as("phone");
    cy.get('[placeholder="SMS code"]').as("sms");
    
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "loginWithPhoneNumber")
          .rejects(new Error("couldntLoginWithThisNumber"));
      });
    cy.get("@phone")
      .type("79150000000")
      .should("have.value", "+7 915 000-00-00");
    cy.contains(/get code/i).should("be.enabled").click();
    cy.get("@sms").type("123456").should("have.value", "123456");
    cy.contains(/log in/i).should("be.enabled").click();
    cy.get("@auth").its("loginWithPhoneNumber").should("be.called");
    cy.contains(/couldn't log in with this phone number/i)
      .should("have.css", "opacity", "1");
    cy.contains(/log in/i).should("be.disabled");
  });
  
  it("error while trying to log in by Google", () => {
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "loginWithGoogle");
      });
    cy.contains(/sign in with google/i).click();
    cy.get("@auth").its("loginWithGoogle").should("be.called");
    
    cy.refresh();
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "getRedirectResult")
          .resolves({ 
            outcome: "failure", 
            cause: "credentialsAlreadyInUse", 
            providerId: "google.com" 
          });
      });
    cy.contains(/an error occurred/i);
    cy.contains(/couldn't log in with google\.com/i);
    cy.contains(/this credential is already associated with a different user account/i);
    cy.contains(/close/i).click();
    cy.contains(/an error occurred/i).should("not.exist");
  });
  
  it("error while trying to log in by Github", () => {
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "loginWithGithub");
      });
    cy.contains(/sign in with github/i).click();
    cy.get("@auth").its("loginWithGithub").should("be.called");
    
    cy.refresh();
    cy.get("@auth")
      .then(auth => {
        cy.stub(auth, "getRedirectResult")
          .resolves({ 
            outcome: "failure", 
            cause: "emailAlreadyInUse", 
            providerId: "github.com" 
          });
      });
    cy.contains(/an error occurred/i);
    cy.contains(/couldn't log in with github\.com/i);
    cy.contains(/the email address is already in use by another account/i);
    cy.contains(/close/i).click();
    cy.contains(/an error occurred/i).should("not.exist");
  });
});
