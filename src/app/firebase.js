// Firebase config and initialization for client-side use
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzOm3STF9YIG4DEoPOqn6Fm9ULnN6T1LM",
  authDomain: "quickstockpos.firebaseapp.com",
  projectId: "quickstockpos",
  storageBucket: "quickstockpos.firebasestorage.app",
  messagingSenderId: "831365404388",
  appId: "1:831365404388:web:ad19ad8674c7ecf5ba3ef1",
  measurementId: "G-5QHK81VMXD"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
