import React, { createContext, useEffect, useState } from "react";
// ASYNCSTORAGE
import AsyncStorage from "@react-native-async-storage/async-storage";
// FIREBASE
import { auth } from "../config/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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
  const Register = async (firstName, email, password, confirmPassword) => {
    try {
      if (password != confirmPassword) {
        throw new Error("Salasanat eivät täsmää");
      } else if (!email || !password || !confirmPassword || !firstName) {
        throw new Error("Sinun tulee täyttää kaikki alueet");
      }

      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      console.error("Virhe rekisteröinnissä " + e);
    }
  };
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
    const storedUserToken = await AsyncStorage.getItem("@userToken");

    if (storedUserToken) {
      setUserToken(storedUserToken);
    } else {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserToken(user.uid);
          await AsyncStorage.setItem("@userToken", user.uid);
        } else {
          setUserToken(null);
          await AsyncStorage.removeItem("@userToken");
        }
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    isLoggedIn();
  }, [userToken]);

  // Reset Password
  const resetPassword = async (email) => {
    try {
      if (!email) {
        throw new Error("Syötä sähköpostiosoite");
      }
      await sendPasswordResetEmail(auth, email);
      alert("Salasanan palautuspyyntö lähetetty sähköpostiin.");
    } catch (e) {
      console.error("Virhe salasanana nollauksessa " + e);
    }
  };
  return (
    <AuthContext.Provider
      value={{ Login, Logout, Register, resetPassword, isLoading, userToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
