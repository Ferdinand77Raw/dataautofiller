import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrqrBZBpM-0AT2Es3kZ--NR8Xgj_Yjsw8",
  authDomain: "mycrm-apps.firebaseapp.com",
  projectId: "mycrm-apps",
  storageBucket: "mycrm-apps.appspot.com",
  messagingSenderId: "719156189393",
  appId: "1:719156189393:web:57d6824db39c8c4dc3cdf0",
  measurementId: "G-TMG16JLEGH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

const logInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
  }
};

export { auth, logInWithEmailAndPassword, db };