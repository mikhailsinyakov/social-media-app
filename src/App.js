import React from 'react';
import { withFirebaseContext } from "./Firebase";

const App = () => {
  return (
    <div>
      Social Media App
    </div>
  );
}

export default withFirebaseContext(App);
