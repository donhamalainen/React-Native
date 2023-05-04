import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
// ID GENERATION
import { generate } from "shortid";

// Firebase
import { database } from "../config/firebaseConfig";
import { set, ref, get, push } from "firebase/database";
import { auth } from "../config/firebaseConfig";

const HomeScreen = ({ gameStatus }) => {
  const [gameID, setGameID] = useState(null);

  // Game
  const createGame = async () => {
    try {
      // ID GENERATION
      const newGameID = generate();
      console.log(newGameID);
      console.log("Uusi peli luotu, ID:", newGameID);
      gameStatus(true);
      // Tallenna peliID AsyncStorageen
      await AsyncStorage.setItem("@game", newGameID);
      // Luojan tiedot
      const userRef = ref(database, `kayttaja/${auth.currentUser.uid}/`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      // Tallenna peliID Firebaseen
      const gameRef = await ref(database, `istunto/${newGameID}`);
      await set(gameRef, {
        peliId: newGameID,
        pelaajienMaara: 0,
        kokonaisRahamaara: 0,
        aktiivisetPelaajat: [
          {
            id: auth.currentUser.uid,
            nimi: userData.nimi,
            pelatutYhteensa: userData.pelatutYhteensa,
            yhteenVeto: userData.yhteenVeto,
            // VAIN PELINAJAN
            sisaanostot: 0,
            lopullinenArvo: 0,
          },
        ],
        poistuneetPelaajat: [],
        aika: Date.now(),
      });
      // Aseta peli id stateen
      setGameID(newGameID);
    } catch (err) {
      console.error("Virhe pelin luonnissa " + err.message);
    }
  };

  const joinGame = async () => {
    try {
      // ID
      if (!gameID) {
        throw new Error("Pelitunnus tulee syöttää!");
      }
      // Tarkista, että peli on olemassa Firebase-tietokannassa
      const gameRef = ref(database, `istunto/${gameID}`);
      console.log(gameRef);
      const snapshot = await get(gameRef);
      if (!snapshot.exists()) throw new Error("Peliä ei löydy");
      console.log("Pelin tarkastus onnistui");

      // Haetaan pelaajan tiedot
      const userID = auth.currentUser.uid;
      console.log(userID);
      const userRef = ref(database, `kayttaja/${userID}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();
      if (!userData) throw new Error("Käyttäjän tietojen lataus epäonnistui");
      console.log("Pelaajan haku onnistui");

      // Lisää pelaaja peliin aktiivisille pelaajille
      const activePlayersRef = ref(
        database,
        `istunto/${gameID}/aktiivisetPelaajat`
      );
      const newPlayerRef = push(activePlayersRef);
      await set(newPlayerRef, {
        id: auth.currentUser.uid,
        nimi: userData.nimi,
        pelatutYhteensa: userData.pelatutYhteensa,
        yhteenVeto: userData.yhteenVeto,
        // VAIN PELINAJAN
        sisaanostot: 0,
        lopullinenArvo: 0,
      });

      console.log("Pelaaja lisätty peliin onnistuneesti");
      // Aseta peli id stateen
      setGameID(gameID);
      // Tapahtuma kun peli on löydetty // Tallennus AsyncStorageen
      await AsyncStorage.setItem("@game", gameID);
      alert("Peliin liitytty onnistuneesti pelitunnuksella " + gameID);
      gameStatus(true);
    } catch (err) {
      console.error("Virhe peliin liittymisessä " + err.message);
      alert("Virhe peliin liittymisessä");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>PokerNoter</Text>
          <Text style={styles.subtitle}>
            Luo uusi peli tai liity olemassaolevaan
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Syötä pelin ID liittyäksesi"
            onChangeText={(text) => setGameID(text)}
            value={gameID}
          />
          <View style={styles.buttonContainer}>
            <Button title="Luo peli" onPress={createGame} />
            <Button title="Liity peliin" onPress={joinGame} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default HomeScreen;
