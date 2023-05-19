import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
// Firebase
import { database, auth } from "../config/firebaseConfig";
import { get, ref, remove, set, onValue } from "firebase/database";

const GameScreen = ({ GameOnline }) => {
  const [inGame, setInGame] = useState(true);
  const [endGame, setEndGame] = useState(false);
  // Siirry odotustilaan
  const goWaitingMode = async () => {
    // Haetaan sessionId
    const sessionId = await AsyncStorage.getItem("@game");
    // Haetaan pelaaja databasesta "pelaajat"
    const pelaajatRef = ref(
      database,
      `pelit/${sessionId}/pelaajat/${auth.currentUser.uid}`
    );
    const pelaajaSnap = await get(pelaajatRef);
    const pelaajaData = pelaajaSnap.val();

    // Siirretään pelaaja odotustilaan
    if (pelaajaData) {
      // Haetaan poistuneetPelaajat lista
      const poistuneetPelaajatRef = ref(
        database,
        `pelit/${sessionId}/poistuneetPelaajat/${auth.currentUser.uid}/`
      );
      // Poista pelaaja "pelaajat" listasta
      await remove(pelaajatRef);
      // Lisää pelaaja "poistuneetPelaajat" listaan
      await set(poistuneetPelaajatRef, pelaajaData);
    }

    setInGame(false);
  };

  const leaveGame = () => {
    // AsyncStorage
    AsyncStorage.removeItem("@game");
    GameOnline(null);
  };

  // Tarkistetaan pelin lopetus mahdollisuus
  const checkEnd = async () => {
    const sessionId = await AsyncStorage.getItem("@game");
    const pelaajatRef = ref(database, `pelit/${sessionId}/pelaajat`);

    onValue(pelaajatRef, (snap) => {
      const pelaajat = snap.val();
      console.log(pelaajat);
      if (!pelaajat || Object.keys(pelaajat).length === 0) {
        setEndGame(true);
      }
    });
  };

  useEffect(() => {
    checkEnd();
  }, [goWaitingMode]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, paddingHorizontal: 25 }}>
        <Text>GameScreen</Text>
        <TouchableOpacity onPress={() => goWaitingMode()}>
          <Text>Siirry odotustilaan</Text>
        </TouchableOpacity>
        {endGame ? (
          <TouchableOpacity onPress={() => leaveGame()}>
            <Text>Poistu pelistä</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;
