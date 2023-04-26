import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import React, { useEffect, useState } from "react";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// QR Code
import QRCode from "react-native-qrcode-svg";

// Firebase
import { database, auth } from "../config/firebaseConfig";
import { ref, set, get, push } from "firebase/database";
const GameScreen = ({ gameStatus, gameID }) => {
  const [inGame, setInGame] = useState(true);
  // Handle Player End Game
  const handlePlayerEndGame = async () => {
    try {
      // Haetaan aktiivisetPelaaja lista
      const aktiivinenPelaajalista = ref(
        database,
        `istunto/${gameID}/aktiivisetPelaajat`
      );
      const aktiivinenPelaajalistaSnapshot = await get(aktiivinenPelaajalista);
      const aktiivinenPelaaja = aktiivinenPelaajalistaSnapshot.val();

      // Haetaan poistuneetPelaajat lista
      const poistuneetPelaajatLista = ref(
        database,
        `istunto/${gameID}/poistuneetPelaajat`
      );

      /* Poistetaan pelaaja aktiivisetPelaajat listalta ja siirretään poistuneetPelaajat listaan */
      // Tarkistaa että löytyykö pelaaja listalta
      const pelaajaIndex = Object.values(aktiivinenPelaaja).findIndex(
        (pelaaja) => pelaaja.id === auth.currentUser.uid
      );
      console.log(pelaajaIndex);
      //console.log(aktiivinenPelaaja["-NTpBu3_i34PQcVG6MsQ"]);
      // console.log(pelaajaIndex);
      if (pelaajaIndex >= 0) {
        // setInGame(false)
      } else {
        throw new Error("Pelaajaa ei löytynyt tietokannasta");
      }
    } catch (e) {
      console.error(e.message);
    }
  };
  // EndGame
  const handleEndGame = async () => {
    await AsyncStorage.clear();
    await gameStatus(false);
  };

  return (
    <SafeAreaView>
      <View>
        <Text>{gameID}</Text>
        <Button onPress={handleEndGame} title="Clear GameScreen" />
        {inGame ? (
          <Button onPress={handlePlayerEndGame} title="Poistu pelaajana" />
        ) : (
          <Text>Olet poistunut</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({});
