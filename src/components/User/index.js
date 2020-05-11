import React, { useState, useEffect, useContext } from "react";
import UserContext from "./context";
import { FirebaseContext } from "components/Firebase";

const withUserContext = Component => props => {
  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useState(undefined);
  
  useEffect(() => {
    firebase.onUserChanged(setUser);
  }, [firebase]);
  
  return (
    <UserContext.Provider value={user}>
      <Component {...props} />
    </UserContext.Provider>
  );
};

export { UserContext, withUserContext };
