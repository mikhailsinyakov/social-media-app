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
  
  async sendSMSCode(phoneNumber) {
    try {
      this.confirmationResult = await this.auth.signInWithPhoneNumber(
        phoneNumber, 
        this.recaptchaVerifier
      );
      return;
    } catch (e) {
      if (e.code === "auth/invalid-phone-number") {
        throw new Error("phoneNumberIsNotValid");
      } else throw new Error("errorSendingSMSCode");
    }
    
  }
  
  async confirmCode (code) {
    try {
      return await this.confirmationResult.confirm(code);
    } catch (e) {
      throw new Error("badVerificationCode");
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
      await this.auth.currentUser.updateProfile({ displayName: username });
      return;
    } catch (e) {
      throw new Error("couldntUpdateUsername");
    }
  }
  
  linkProvider(id) {
    const provider = this.providers[id];
    this.auth.currentUser.linkWithRedirect(provider);
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
      await this.auth.currentUser.unlink(id);
      return;
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
}
 
export default Firebase;
