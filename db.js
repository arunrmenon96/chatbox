import firebase from 'firebase'
import 'firebase/firestore'
const config = {
  apiKey: "AIzaSyBPKzgU7og6b2mmPcXfik85qTaBS-1W0WA",
  authDomain: "praticeapp-e69b0.firebaseapp.com",
  databaseURL: "https://praticeapp-e69b0.firebaseio.com",
  projectId: "praticeapp-e69b0",
  storageBucket: "praticeapp-e69b0.appspot.com",
  messagingSenderId: "408984680621"
};
// const config = {
//   apiKey: "AIzaSyC7kIJ7T1sLRWYT8yhirrLOuEw-5MSEVg4",
//   authDomain: "cp3700-f5264.firebaseapp.com",
//   databaseURL: "https://cp3700-f5264.firebaseio.com",
//   projectId: "cp3700-f5264",
//   storageBucket: "cp3700-f5264.appspot.com",
//   messagingSenderId: "143283342395"
//   };
firebase.initializeApp(config);
// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});
export default db;