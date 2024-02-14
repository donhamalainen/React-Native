// FIREBASE
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth/react-native";
import { getDatabase } from "firebase/database";

// ASYNC
import AsyncStorage from "@react-native-async-storage/async-storage";
// Config
const firebaseConfig = {
  measurementId: "G-G8HZDL350F",
  apiKey: "AIzaSyAaiIkmqZCZS479l-AfLERSMW0UNYdfDyg",
  authDomain: "pokernoter-e7f51.firebaseapp.com",
  databaseURL:
    "https://pokernoter-e7f51-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pokernoter-e7f51",
  storageBucket: "pokernoter-e7f51.appspot.com",
  messagingSenderId: "1025585708715",
  appId: "1:1025585708715:web:b634dd70a3a71efbdcc1ee",
};

// Initialize Firebase
let app;
let auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
    popupRedirectResolver: undefined,
  });
} else {
  app = getApp();
  auth = getAuth(app);
}
const database = getDatabase(app);
export { auth, database };
