import Constants from "expo-constants";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: Constants?.manifest?.extra?.apiKey,
  authDomain: Constants?.manifest?.extra?.authDomain,
  databaseURL: Constants?.manifest?.extra?.databaseURL,
  projectId: Constants?.manifest?.extra?.projectId,
  storageBucket: Constants?.manifest?.extra?.storageBucket,
  messagingSenderId: Constants?.manifest?.extra?.messagingSenderId,
  appId: Constants?.manifest?.extra?.appId,
  measurementId: Constants?.manifest?.extra?.measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Rekisteröintyminen Firebase Authenticationilla
const SignUp = async (
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) => {
  try {
    if (password != confirmPassword) {
      throw new Error("Salasanat eivät täsmää");
    } else if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName
    ) {
      throw new Error("Tarkista että kaikki alueet on täytetty");
    }
    await createUserWithEmailAndPassword(auth, email, password).then(
      async (res) => {
        // Save database
        const userRef = ref(database, "kayttaja/" + res.user.uid);
        await set(userRef, {
          nimi: firstName,
          sukunimi: lastName,
          pelatutYhteensa: 0,
          yhteenVeto: 0,
          pelatutPelit: {
            aika: new Date().getTime(),
          },
        }).then(() => {
          alert("Rekisteröinti onnistui");
          console.log("Rekisteröinti onnistui");
          console.log("Käyttäjätietojen tallennus databaseen onnistui");
        });
      }
    );
  } catch (e) {
    console.error(e);
  }
};

// Kirjaudutaan sisään Firebase Authenticationilla
const SignIn = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error(
        "Sinun tulee täyttää sähköpostiosoite ja salasana edetäksesi"
      );
    }
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
  }
};
// Kirjaudutaan ulos Firebase Authenticationista
const SignOut = async () => {
  try {
    await auth.signOut();
    console.log("Kirjautuminen ulos onnistui");
  } catch (error) {
    console.log(error);
  }
};

export { SignIn, SignOut, SignUp, auth, database };
