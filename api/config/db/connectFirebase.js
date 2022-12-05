import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCBCDzQEUB_cqFwNsLB0aBgZ7SpTmF5pT8",
  authDomain: "photo-social-mem-765b3.firebaseapp.com",
  projectId: "photo-social-mem-765b3",
  storageBucket: "photo-social-mem-765b3.appspot.com",
  messagingSenderId: "183149063811",
  appId: "1:183149063811:web:b5889df8f65901e13ff5b6",
  measurementId: "G-KME5KYKW1H"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage =firebase.storage();

export {db,auth,storage};