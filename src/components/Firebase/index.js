import React from "react";
import Firebase from "./firebase";
import FirebaseContext from "./context";

const withFirebaseContext = Component => props =>
  <FirebaseContext.Provider value={new Firebase()}>
    <Component {...props} />
  </FirebaseContext.Provider>;
  
export { FirebaseContext, withFirebaseContext };
