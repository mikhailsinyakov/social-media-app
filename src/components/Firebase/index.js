import React from "react";
import Firebase from "./firebase";
import FirebaseContext from "./context";

const withFirebaseContext = Component => props =>
  <Context.Provider value={new Firebase()}>
    <Component {...props} />
  </Context.Provider>;
  
export { FirebaseContext, withFirebaseContext };
