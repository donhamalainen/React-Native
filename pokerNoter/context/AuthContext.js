import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
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
    await signInWithEmailAndPassword(auth, email, password).catch((err) => {
      let errorMessage;
      switch (err.code) {
        case "auth/missing-email":
          errorMessage = "Sähköpostiosoite puuttuu.";
          break;
        case "auth/missing-password":
          errorMessage = "Salasana puuttuu.";
          break;
        case "auth/invalid-email":
          errorMessage = "Virheellinen sähköpostimuoto.";
          break;
        case "auth/user-disabled":
          errorMessage = "Käyttäjätili on poistettu käytöstä.";
          break;
        case "auth/user-not-found":
          errorMessage = "Tällä sähköpostilla ei löydy käyttäjää.";
          break;
        case "auth/wrong-password":
          errorMessage = "Väärä salasana.";
          break;
        default:
          errorMessage = err.message;
      }
      // Ilmoitus
      Alert.alert("Virhe", errorMessage);
    });
  };

  // REGISTER
  const Register = async (firstName, email, password, confirmPassword) => {
    if (password != confirmPassword) {
      Alert.alert("Virhe", "Salasanat eivät täsmää");
    } else if (!email || !password || !confirmPassword || !firstName) {
      Alert.alert("Virhe", "Sinun tulee täyttää kaikki alueet");
    } else {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          // Tallennetaan tiedot
          console.log(user.user.uid);
          set(ref(database, `kayttajat/${user.user.uid}`), {
            nimi: firstName,
            sähköposti: email,
          });
        })
        .catch((err) => {
          let errorMessage;
          switch (err.code) {
            case "auth/invalid-email":
              errorMessage = "Virheellinen sähköpostimuoto.";
              break;
            case "auth/email-already-in-use":
              errorMessage = "Tällä sähköpostilla on olemassa jo käyttäjä.";
              break;
            case "auth/weak-password":
              errorMessage = "Salasanan tulisi olla vähintään 6 merkkiä pitkä";
              break;
            default:
              errorMessage = err.message;
          }
          // Ilmoitus
          Alert.alert("Virhe", errorMessage);
        });
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
