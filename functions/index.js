const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.addUserToFirestore = functions.auth.user().onCreate(user => {
  return admin.firestore().doc(`/users/${user.uid}`).set({username: null})
    .then(() => console.log("User has added"));
});

exports.deleteUserFromFirestore = functions.auth.user().onDelete(user => {
  return admin.firestore().doc(`/users/${user.uid}`).delete()
    .then(() => console.log("User has removed"));
});
