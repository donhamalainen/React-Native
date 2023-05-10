// FIREBASE
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth/react-native";
import { getDatabase } from "firebase/database";

// CONSTANTS
import Constants from "expo-constants";
// ASYNC
import AsyncStorage from "@react-native-async-storage/async-storage";
// Config
const firebaseConfig = {
  apiKey: Constants?.manifest?.extra?.APIKEY,
  authDomain: Constants?.manifest?.extra?.AUTHDOMAIN,
  databaseURL: Constants?.manifest?.extra?.DATABASE_URL,
  projectId: Constants?.manifest?.extra?.PROJECT_ID,
  storageBucket: Constants?.manifest?.extra?.STORAGE_BUCKET,
  messagingSenderId: Constants?.manifest?.extra?.MSI,
  appId: Constants?.manifest?.extra?.APPID,
  measurementId: Constants?.manifest?.extra?.MEASUREMENT_ID,
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
