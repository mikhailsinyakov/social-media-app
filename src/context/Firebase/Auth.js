import "firebase/auth";

class Auth {
  constructor(app) {
    this.app = app;
    this.auth = app.auth();
    this.googleProvider = new this.app.auth.GoogleAuthProvider();
    this.githubProvider = new this.app.auth.GithubAuthProvider();
    this.providers = {
      "google.com": this.googleProvider,
      "github.com": this.githubProvider
    };
  }
  
  onUserChanged(fn) {
    this.auth.onAuthStateChanged(fn);
  }
  
  getCurrentUser() {
    return this.auth.currentUser;
  }
  
  setLanguage(language) {
    this.auth.languageCode = language;
  }
  
  createRecaptchaVerifier() {
    this.recaptchaVerifier = new this.app.auth.RecaptchaVerifier(
      "recaptcha", 
      { size: "invisible" }
    );
  }
  
  async sendSMSCode(phoneNumber) {
    try {
      this.confirmationResult = await this.auth.signInWithPhoneNumber(
        phoneNumber, 
        this.recaptchaVerifier
      );
    } catch (e) {
      if (e.code === "auth/invalid-phone-number") {
        throw new Error("phoneNumberIsNotValid");
      } else throw new Error("errorSendingSMSCode");
    }
  }
  
  getPhoneCredential(code) {
    return this.app.auth.PhoneAuthProvider.credential(
      this.confirmationResult.verificationId,
      code
    );
  }
  
  handleConfirmCodeError(e, defaultError) {
    if (e.code === "auth/invalid-verification-code") {
      throw new Error("badVerificationCode");
    } else if (e.code === "auth/credential-already-in-use") {
      throw new Error("phoneNumberAlreadyInUse");
    } else {
      throw new Error(defaultError);
    }
  }
  
  async loginWithPhoneNumber (code) {
    const credential = this.getPhoneCredential(code);
    try {
      await this.auth.signInWithCredential(credential);
    } catch (e) {
      this.handleConfirmCodeError(e, "couldntLoginWithThisNumber");
    }
  }
  
  async linkPhoneNumber(code) {
    const credential = this.getPhoneCredential(code);
    try {
      await this.getCurrentUser().linkWithCredential(credential);
    } catch (e) {
      this.handleConfirmCodeError(e, "couldntLoginWithThisNumber");
    }
  }
  
  async changePhoneNumber(code) {
    const credential = this.getPhoneCredential(code);
    try {
      await this.getCurrentUser().updatePhoneNumber(credential);
    } catch (e) {
      this.handleConfirmCodeError(e, "couldntChangePhoneNumber");
    }
  }
  
  async reauthenticate(code) {
    const credential = this.getPhoneCredential(code);
    try {
      await this.getCurrentUser().reauthenticateWithCredential(credential);
    } catch (e) {
      this.handleConfirmCodeError(e, "couldntCheckPhoneNumber");
    }
  }
  
  logOut() {
    this.auth.signOut();
  }
  
  async updateUsername(username) {
    try {
      await this.getCurrentUser().updateProfile({ displayName: username });
    } catch (e) {
      throw new Error("couldntUpdateUsername");
    }
  }
  
  linkProvider(id) {
    const provider = this.providers[id];
    this.getCurrentUser().linkWithRedirect(provider);
  }
  
  getRedirectResult() {
    return new Promise(resolve => {
      this.auth.getRedirectResult()
        .then(result => {
          const outcome = result.credential ? "success" : null;
          resolve({ outcome });
        }).catch(e => {
          let cause;
          if (e.code === "auth/credential-already-in-use") {
            cause = "credentialsAlreadyInUse";
          } else if (e.code === "auth/email-already-in-use") {
            cause = "emailAlreadyInUse";
          } else cause = "";
          resolve({ outcome: "failure", cause, providerId: e.credential.providerId });
        });
    });
  }
  
  async unlinkProvider(id) {
    try {
      await this.getCurrentUser().unlink(id);
    } catch (e) {
      throw new Error("couldntUnlink");
    }
  }
  
  loginWithGoogle() {
    this.auth.signInWithRedirect(this.googleProvider);
  }
  
  loginWithGithub() {
    this.auth.signInWithRedirect(this.githubProvider);
  }
  
  async deleteAccount() {
    try {
      await this.getCurrentUser().delete();
    } catch (e) {
      if (e.code === "auth/requires-recent-login") {
        throw new Error("Requires recent login");
      } else throw new Error("couldntDeleteAccount");
    }
  }
}

export default Auth;
