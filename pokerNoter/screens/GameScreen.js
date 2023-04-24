import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import React, { useEffect, useState } from "react";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// QR Code
import QRCode from "react-native-qrcode-svg";

// Firebase
import { database, auth } from "../config/firebaseConfig";
import { ref, set, get, push, remove } from "firebase/database";
const GameScreen = ({ gameStatus, gameID }) => {
  const [inGame, setInGame] = useState(true);
  // Handle Player End Game
  const handlePlayerEndGame = async () => {
    try {
      // Haetaan aktiivisetPelaaja lista
      const activePlayersRef = ref(
        database,
        `istunto/${gameID}/aktiivisetPelaajat`
      );

      const activePlayersSnapshot = await get(activePlayersRef);
      const activePlayers = activePlayersSnapshot.val();
      // Haetaan poistuneet Pelaajat lista
      const inactivePlayersRef = ref(
        database,
        `istunto/${gameID}/poistuneetPelaajat`
      );

      // Poistetaan pelaaja aktiivisetPelaajat listalta ja siirretään poistuneetPelaajat listaan
      const playerIndex = activePlayers.findIndex(
        (player) => player.id === auth.currentUser.uid
      );
      if (playerIndex >= 0) {
        const player = activePlayers[playerIndex];
        const newPlayerRef = await push(inactivePlayersRef);
        console.log(player);
        console.log(newPlayerRef);
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
        <Button onPress={handlePlayerEndGame} title="Poistu pelaajana" />
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({});
