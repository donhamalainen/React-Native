import { createContext, useEffect, useState } from "react";
// FIREBASE
import { auth, database } from "../config/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { set, ref, onValue } from "firebase/database";

// CONTEXT
export const AuthContext = createContext();
// PROVIDER
export const AuthProvider = ({ children }) => {
  // VARIABLES
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async (uid) => {
    const dataRef = ref(database, `kayttajat/${uid}`);
    onValue(dataRef, (snap) => {
      const data = snap.val();
      //console.log(Object.values(data));
      setData(data);
    });
  };

  // isLoggedIn
  const isLoggedIn = () => {
    setIsLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserToken(user.uid);
        fetchData(user.uid);
      } else {
        setUserToken(null);
        setData(null);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  // LOGIN
  const Login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      console.error("Virhe sisäänkirjautumisessa " + e);
      alert(e);
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

      await createUserWithEmailAndPassword(auth, email, password).then(
        (user) => {
          // Tallennetaan tiedot
          console.log(user.user.uid);
          set(ref(database, `kayttajat/${user.user.uid}`), {
            nimi: firstName,
            sähköposti: email,
          });
        }
      );
    } catch (e) {
      console.error("Virhe rekisteröinnissä " + e);
      alert(e);
    }
  };

  // LOGOUT
  const Logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Virhe uloskirjautumisessa " + e);
      alert(e);
    }
  };

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
      value={{
        Login,
        Logout,
        Register,
        resetPassword,
        isLoading,
        userToken,
        data,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
