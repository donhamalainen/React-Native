import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
// Firebase
import { database, auth } from "../config/firebaseConfig";
import { get, ref, remove, set, onValue, off } from "firebase/database";

const GameScreen = ({ GameOnline }) => {
  // Variables
  const [inGame, setInGame] = useState(true);
  const [endGame, setEndGame] = useState(false);
  // Peli-istunnon tiedot
  const [gameSessionData, setGameSessionData] = useState(null);

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
      //console.log(pelaajat);
      if (!pelaajat || Object.keys(pelaajat).length === 0) {
        setEndGame(true);
      }
    });
  };

  useEffect(() => {
    checkEnd();
  }, [inGame]);

  // Päivitä peli-istunnon tiedot
  const updateGameSessionData = async () => {
    const sessionId = await AsyncStorage.getItem("@game");
    const gameSessionRef = ref(database, `pelit/${sessionId}`);
    const listener = onValue(gameSessionRef, (snapshot) => {
      setGameSessionData(snapshot.val());
    });
    return () => {
      off(gameSessionRef, listener);
    };
  };

  // Hae tiedot, kun komponentti ladataan ja päivitä niitä muutosten yhteydessä
  useEffect(() => {
    updateGameSessionData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, paddingHorizontal: 25 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Title */}
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>PokerNoter</Text>
          {/* TIMER 
           <Text style={{ fontSize: 14, fontWeight: "bold" }}>hh:mm:ss</Text>
          */}
        </View>
        {/* Pöytä tiedot */}
        <View
          style={{
            backgroundColor: "#212A3E",
            padding: 20,
            gap: 20,
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          {/* Pelaajia pöydässä */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 16,
                fontStyle: "italic",
                fontWeight: "600",
                color: "white",
              }}
            >
              Pelaajia pöydässä:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontStyle: "italic",
                fontWeight: "400",
                color: "white",
              }}
            >
              {gameSessionData
                ? Object.keys(gameSessionData.pelaajat).length
                : 0}{" "}
              henkilöä
            </Text>
          </View>

          {/* Rahamäärä pöydässä */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 16,
                fontStyle: "italic",
                fontWeight: "600",
                color: "white",
              }}
            >
              Rahaa pöydässä yhteensä:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontStyle: "italic",
                fontWeight: "400",
                color: "white",
              }}
            >
              {gameSessionData ? gameSessionData.kokonaisRahamaara : 0} €
            </Text>
          </View>
        </View>

        {/* Poistu pelistä painike */}
        {endGame ? (
          <TouchableOpacity onPress={() => leaveGame()}>
            <Text style={{ fontSize: 18 }}>Poistu pelistä</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => goWaitingMode()}>
            <Text>Siirry odotustilaan</Text>
          </TouchableOpacity>
        )}

        {/* Pelaaja lista */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 40,
            paddingBottom: 10,
            alignItems: "center",
            borderBottomWidth: 2,
            borderColor: "gray",
          }}
        >
          <Text style={{ fontSize: 20 }}>Pelaajat</Text>
          <Text>Buy In</Text>
        </View>
        <ScrollView>
          {/* Aktiiviset pelaajat */}
          {gameSessionData &&
            gameSessionData.pelaajat &&
            Object.entries(gameSessionData.pelaajat).map(([key, pelaaja]) => (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontStyle: "italic",
                    fontWeight: "600",
                    color: "black",
                  }}
                >
                  {pelaaja.nimi}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontStyle: "italic",
                    fontWeight: "400",
                    color: "black",
                  }}
                >
                  {pelaaja.buyIn} €
                </Text>
              </View>
            ))}
          {/* Poistuneet pelaajat */}
          {gameSessionData &&
            gameSessionData.poistuneetPelaajat &&
            Object.entries(gameSessionData.poistuneetPelaajat).map(
              ([key, pelaaja]) => (
                <View
                  key={key}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontStyle: "italic",
                      fontWeight: "600",
                      color: "red",
                    }}
                  >
                    {pelaaja.nimi}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontStyle: "italic",
                      fontWeight: "400",
                      color: "red",
                    }}
                  >
                    {pelaaja.buyIn} €
                  </Text>
                </View>
              )
            )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;
