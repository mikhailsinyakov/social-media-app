import app from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
 
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
 
class Firebase {
  constructor() {
    if (!app.apps.length) app.initializeApp(config);
    this.auth = app.auth();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.githubProvider = new app.auth.GithubAuthProvider();
    this.providers = {
      "google.com": this.googleProvider,
      "github.com": this.githubProvider
    };
  }
  
  createRecaptchaVerifier() {
    this.recaptchaVerifier = new app.auth.RecaptchaVerifier(
      "recaptcha", 
      { "size": 'invisible' }
    );
  }
  
  getCurrentUser() {
    return this.auth.currentUser;
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
  
  async confirmCode (code) {
    try {
      await this.confirmationResult.confirm(code);
    } catch (e) {
      if (e.code === "auth/invalid-verification-code") {
        throw new Error("badVerificationCode");
      } else throw new Error("couldntLoginWithThisNumber");
    }
  }
  
  async linkPhoneNumber(code) {
    const credential = app.auth.PhoneAuthProvider.credential(
      this.confirmationResult.verificationId,
      code
    );
    try {
      await this.getCurrentUser().linkWithCredential(credential);
    } catch (e) {
      if (e.code === "auth/credential-already-in-use") {
        throw new Error("phoneNumberAlreadyInUse");
      } else if (e.code === "auth/invalid-verification-code") {
        throw new Error("badVerificationCode");
      } else throw new Error("couldntLinkThisNumber");
    }
  }
  
  async changePhoneNumber(code) {
    const credential = app.auth.PhoneAuthProvider.credential(
      this.confirmationResult.verificationId,
      code
    );
    try {
      await this.getCurrentUser().updatePhoneNumber(credential);
    } catch (e) {
      if (e.code === "auth/credential-already-in-use") {
        throw new Error("phoneNumberAlreadyInUse");
      } else if (e.code === "auth/invalid-verification-code") {
        throw new Error("badVerificationCode");
      } else throw new Error("couldntChangePhoneNumber");
    }
  }
  
  async reauthenticate(code) {
    const credential = app.auth.PhoneAuthProvider.credential(
      this.confirmationResult.verificationId,
      code
    );
    try {
      await this.getCurrentUser().reauthenticateWithCredential(credential);
    } catch (e) {
      if (e.code === "auth/invalid-verification-code") {
        throw new Error("badVerificationCode");
      } else throw new Error("couldntCheckPhoneNumber");
    }
  }
  
  onUserChanged(fn) {
    this.auth.onAuthStateChanged(fn);
  }
  
  setLanguage(language) {
    this.auth.languageCode = language;
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
 
export default Firebase;
