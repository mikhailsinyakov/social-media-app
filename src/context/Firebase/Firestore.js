import "firebase/firestore";

class Firestore {
  constructor(app) {
    this.app = app;
    this.db = app.firestore();
    this.usersRef = this.db.collection("users");
  }
}

export default Firestore;
