import React, { useState, useEffect, useContext, useCallback } from "react";
import UserContext from "./context";
import { FirebaseContext } from "context/Firebase";

const isUsernameValid = value => {
  if (!value) return false;
  const modifiedValue = "@" + value.replace(/\W/g, "").toLowerCase();
  return value.length >= 4 && value === modifiedValue;
};

const addUsernameProp = user => {
  if (user) {
    user = {
      ...user,
      username: isUsernameValid(user.displayName) ? user.displayName : null
    };
  }
  return user;
};

const withUserContext = Component => props => {
  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useState(undefined);
  
  const updateUser = useCallback(modifiedUser => {
    setUser(addUsernameProp(modifiedUser));
  }, [setUser]);
  
  useEffect(() => {
    firebase.auth.onUserChanged(updateUser);
  }, [firebase, updateUser]);
  
  return (
    <UserContext.Provider 
      value={{user, updateUser: () => updateUser(firebase.auth.getCurrentUser())}}
    >
      <Component {...props} />
    </UserContext.Provider>
  );
};

export { UserContext, withUserContext };
