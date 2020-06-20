import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import { attachCustomCommands } from "cypress-firebase";

const fbConfig = {
  apiKey: Cypress.env("FIREBASE_API_KEY"),
  authDomain: Cypress.env("FIREBASE_AUTH_DOMAIN"),
  databaseURL: Cypress.env("FIREBASE_DATABASE_URL"),
  projectId: Cypress.env("FIREBASE_PROJECT_ID"),
  storageBucket: Cypress.env("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: Cypress.env("FIREBASE_MESSAGING_SENDER_ID"),
  appId: Cypress.env("FIREBASE_APP_ID")
};

firebase.initializeApp(fbConfig);

attachCustomCommands({ Cypress, cy, firebase });

Cypress.Commands.add(
  'init',
  () => {
    cy.visit("/");
    cy.window()
      .its("firebase")
      .its("auth").as("auth");
});

Cypress.Commands.add(
  'nullifyUsername',
  () => {
    cy.get("@auth")
      .invoke("updateUsername", null);
});

Cypress.Commands.add(
  'refresh',
  () => {
    cy.reload();
    cy.window()
      .its("firebase")
      .its("auth").as("auth");
});

Cypress.Commands.add(
  'stubAndCheck',
  (action, alias, method, argument) => {
    let stub;
    cy.get(alias)
      .then(obj => {
        stub = cy.stub(obj, method);
      });
    action();
    if (argument) {
      cy.get(alias)
        .its(method)
        .should("be.calledWith", argument)
        .then(() => stub.restore());
    } else {
      cy.get(alias)
        .its(method)
        .should("be.called")
        .then(() => stub.restore());
    }
    
});

Cypress.Commands.add(
  'usePhoneNumber', 
  action => {
    cy.document()
      .then(document => {
        const recaptcha = document.createElement("div");
        recaptcha.id = "recaptcha";
        document.body.appendChild(recaptcha);
      });
    cy.get("@auth")
      .invoke("sendSMSCode", "+79150000000");
    cy.get("@auth")
      .invoke(action, "123456");
    cy.get("#recaptcha").then(recaptcha => recaptcha.remove());
});

Cypress.Commands.add(
  'loginWithPhoneNumber', 
  () => {
    cy.usePhoneNumber("loginWithPhoneNumber");
});

Cypress.Commands.add(
  'checkPhoneNumber', 
  () => {
    cy.usePhoneNumber("reauthenticate");
});

Cypress.Commands.add(
  'linkPhoneNumber', 
  () => {
    cy.usePhoneNumber("linkPhoneNumber");
});

Cypress.Commands.add(
  'getGoogleToken',
  () => {
    cy.request({
      url: Cypress.env("GOOGLE_AUTH_URL"),
      headers: {
        cookie: Cypress.env("GOOGLE_AUTH_COOKIE")
      }, 
      followRedirect: false
    })
    .its("redirectedToUrl")
    .then(redirectedToUrl => {
      const url = new URL(redirectedToUrl);
      const code = url.searchParams.get("code");
      cy.request({
        url: "https://www.googleapis.com/oauth2/v4/token",
        method: "POST",
        form: true,
        body: {
          code,
          redirect_uri: Cypress.env("GOOGLE_REDIRECT_URI"),
          client_id: Cypress.env("GOOGLE_CLIENT_ID"),
          client_secret: Cypress.env("GOOGLE_CLIENT_SECRET"),
          grant_type: "authorization_code"
        }
      })
      .its("body")
      .then(body => body.access_token);
    });
});

Cypress.Commands.add(
  'loginWithGoogle', 
  () => {
    cy.getGoogleToken()
      .then(token => {
        cy.get("@auth")
          .invoke("loginWithGoogle", token);
      });
});

Cypress.Commands.add(
  'linkGoogle',
  () => {
    cy.getGoogleToken()
      .then(token => {
        cy.get("@auth")
          .invoke("linkProvider", "google.com", token);
      });
});

Cypress.Commands.add(
  'getGithubToken',
  () => {
    cy.request({
      url: Cypress.env("GITHUB_AUTH_URL"),
      headers: {
        cookie: Cypress.env("GITHUB_AUTH_COOKIE")
      }, 
      followRedirect: false
    })
    .its("redirectedToUrl")
    .then(redirectedToUrl => {
      const url = new URL(redirectedToUrl);
      const code = url.searchParams.get("code");
      cy.request({
        url: "https://github.com/login/oauth/access_token",
        method: "POST",
        form: true,
        body: {
          code,
          client_id: Cypress.env("GITHUB_CLIENT_ID"),
          client_secret: Cypress.env("GITHUB_CLIENT_SECRET"),
        }
      })
      .its("body")
      .then(body => {
        const params = body.split("&")
          .reduce((obj, param) => {
            const [key, value] = param.split("=");
            obj[key] = value;
            return obj;
          }, {});
        return params.access_token;
      })
    });
});

Cypress.Commands.add(
  'loginWithGithub', 
  () => {
    cy.getGithubToken()
      .then(token => {
        cy.get("@auth")
          .invoke("loginWithGithub", token);
      });
});

Cypress.Commands.add(
  'linkGithub',
  () => {
    cy.getGithubToken()
      .then(token => {
        cy.get("@auth")
          .invoke("linkProvider", "github.com", token);
      });
});
