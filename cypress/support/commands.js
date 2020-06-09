// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

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
