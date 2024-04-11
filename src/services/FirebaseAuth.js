import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "api-key",
  authDomain: "***",
  projectId: "***",
  storageBucket: "***",
  messagingSenderId: "***",
  appId: "api-id",
  measurementId: "****"
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