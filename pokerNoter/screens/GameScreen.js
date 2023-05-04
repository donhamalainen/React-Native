import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import React, { useEffect, useState } from "react";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// QR Code
import QRCode from "react-native-qrcode-svg";

// Firebase
import { database, auth } from "../config/firebaseConfig";
import { ref, set, get, push, onValue } from "firebase/database";

const GameScreen = ({ gameStatus, gameID }) => {
  const [inGame, setInGame] = useState(true);
  const [pelaajaLista, setPelaajaLista] = useState([]);
  // Handle Player End Game
  const handlePlayerEndGame = async () => {
    try {
      // Haetaan aktiivisetPelaaja lista
      const aktiivisetRef = ref(
        database,
        `istunto/${gameID}/aktiivisetPelaajat`
      );
      const aktiivisetSnap = await get(aktiivisetRef);
      const aktiivisetPelaajat = Object.values(aktiivisetSnap.val());

      // Haetaan poistuneet pelaajat lista
      const poistuneetRef = ref(
        database,
        `istunto/${gameID}/poistuneetPelaajat`
      );
      const playerIndex = aktiivisetPelaajat.findIndex(
        (player) => player.id === auth.currentUser.uid
      );
      // Jos pelaaja löytyy aktiivisista
      if (playerIndex >= 0) {
        const player = aktiivisetPelaajat[playerIndex];
        await set(push(poistuneetRef), player); // lisätään pelaaja poistuneiden pelaajien listalle
        aktiivisetPelaajat.splice(playerIndex, 1); // poistetaan pelaaja aktiivisista pelaajista
        await set(aktiivisetRef, aktiivisetPelaajat); // tallennetaan päivitetty aktiivisten pelaajien lista tietokantaan
        setInGame(false);
      }
    } catch (e) {
      console.error(e.message);
    }
  };
  // Hae pelaaja lista
  const getPlayers = async () => {
    try {
      const aktiivisetPelaajatLista = ref(
        database,
        `istunto/${gameID}/aktiivisetPelaajat`
      );
      const aktiivisetPelaajatSnapshot = await get(aktiivisetPelaajatLista);
      const aktiivisetPelaaja = aktiivisetPelaajatSnapshot.val() || {};
      const kaikkiPelaajat = [...Object.values(aktiivisetPelaaja)];
      setPelaajaLista(kaikkiPelaajat);
    } catch (e) {
      console.error("Virhe pelaajien haussa " + e.message);
    }
  };

  useEffect(() => {
    getPlayers();
    const unsub = onValue(
      ref(database, `istunto/${gameID}/aktiivisetPelaajat`),
      () => {
        getPlayers();
      }
    );
    return () => {
      unsub();
    };
  }, [gameID]);

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
        <Text>Pelaajat:</Text>
        {pelaajaLista.map((pelaaja) => (
          <Text key={pelaaja?.id}>{pelaaja.nimi}</Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({});
