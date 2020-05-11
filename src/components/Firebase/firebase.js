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
  
  confirmCode (code) {
    return this.confirmationResult.confirm(code);
  }
  
  onUserChanged(fn) {
    this.auth.onAuthStateChanged(fn);
  }
}
 
export default Firebase;
