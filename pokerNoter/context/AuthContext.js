import React, { createContext, useEffect, useState } from "react";
// ASYNCSTORAGE
import AsyncStorage from "@react-native-async-storage/async-storage";
// FIREBASE
import { auth } from "../config/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);

  // LOGIN
  const Login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(() => {
        setUserToken(auth.currentUser.uid);
        AsyncStorage.setItem("@userToken", auth.currentUser.uid);
        setIsLoading(true);
      });
    } catch (e) {
      console.error("Virhe sisäänkirjautumisessa " + e);
    }
  };

  // REGISTER
  const Register = async (firstName, email, password, confirmPassword) => {};
  // LOGOUT
  const Logout = async () => {
    try {
      await signOut(auth).then(() => {
        setUserToken(null);
        AsyncStorage.removeItem("@userToken");
        setIsLoading(true);
      });
    } catch (e) {
      console.error("Virhe uloskirjautumisessa " + e);
    }
  };

  // isLoggedIn
  const isLoggedIn = async () => {
    setIsLoading(true);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserToken(user.uid);
        await AsyncStorage.setItem("@userToken", user.uid);
      } else {
        setUserToken(null);
        await AsyncStorage.removeItem("@userToken");
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    isLoggedIn();
  }, [userToken]);
  return (
    <AuthContext.Provider value={{ Login, Logout, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};
