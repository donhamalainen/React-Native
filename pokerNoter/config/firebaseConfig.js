// FIREBASE
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// CONSTANTS
import Constants from "expo-constants";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyAaiIkmqZCZS479l-AfLERSMW0UNYdfDyg",
  authDomain: "pokernoter-e7f51.firebaseapp.com",
  databaseURL:
    "https://pokernoter-e7f51-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pokernoter-e7f51",
  storageBucket: "pokernoter-e7f51.appspot.com",
  messagingSenderId: "1025585708715",
  appId: "1:1025585708715:web:b634dd70a3a71efbdcc1ee",
  measurementId: "G-G8HZDL350F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
