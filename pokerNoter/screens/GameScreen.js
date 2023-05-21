import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
// Icons
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// QRCode
import QRCode from "react-native-qrcode-svg";
// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
// Firebase
import { database, auth } from "../config/firebaseConfig";
import { get, ref, remove, set, onValue, update } from "firebase/database";

const GameScreen = ({ GameOnline, inGame }) => {
  // Variables
  const [endGame, setEndGame] = useState(false);
  const [showQr, setShowQr] = useState(false);
  // Säilytä peli-istunnon id tilamuuttujassa
  const [sessionId, setSessionId] = useState(null);
  // Peli-istunnon tiedot
  const [gameSessionData, setGameSessionData] = useState(null);

  // HandleShare
  const HandleShare = async () => {
    setShowQr(!showQr);
  };
  // Siirry odotustilaan
  const goWaitingMode = () => {
    Alert.alert(
      "Vahvista",
      "Olet poistumassa pöydästä, haluatko jatkaa? Muista että et voi enää liittyä takaisin",
      [
        {
          text: "En",
          onPress: () => console.log("Poistuminen peruutettu"),
          style: "cancel",
        },
        {
          text: "Kyllä",
          onPress: () => {
            Alert.prompt(
              "Syötä chippien rahallinen arvo",
              "Syötä chippien rahallinen arvo",
              [
                {
                  text: "Peruuta",
                  onPress: () =>
                    console.log("Chippien arvon syöttö peruutettu"),
                  style: "cancel",
                },
                {
                  text: "Vahvista",
                  onPress: async (chipAmount) => {
                    if (chipAmount !== "") {
                      if (!isNaN(chipAmount)) {
                        chipAmount = parseFloat(chipAmount);
                        // Tehdään tallennukset
                        // Haetaan pelaaja databasesta "pelaajat"
                        const id = await AsyncStorage.getItem("@game");
                        const pelaajatRef = ref(
                          database,
                          `pelit/${id}/pelaajat/${auth.currentUser.uid}`
                        );
                        const pelaajaSnap = await get(pelaajatRef);
                        const pelaajaData = pelaajaSnap.val();

                        // Siirretään pelaaja odotustilaan
                        if (pelaajaData) {
                          // Haetaan poistuneetPelaajat lista
                          const poistuneetPelaajatRef = ref(
                            database,
                            `pelit/${id}/poistuneetPelaajat/${auth.currentUser.uid}/`
                          );
                          // Poista pelaaja "pelaajat" listasta
                          await remove(pelaajatRef);
                          // Lisää pelaaja "poistuneetPelaajat" listaan
                          await set(poistuneetPelaajatRef, pelaajaData);
                        }

                        // Tallennetaan tiedot henkilökohtaiselle tietokannalle
                        const userRef = ref(
                          database,
                          `kayttajat/${auth.currentUser.uid}`
                        );
                        const userSnap = await get(userRef);
                        const peliHistoria = userSnap.val().peliHistoria || {};
                        const personalBuyIn =
                          gameSessionData.pelaajat[auth.currentUser.uid].buyIn;
                        const profit = chipAmount - personalBuyIn;
                        const newPeliHistoria = {
                          ...peliHistoria,
                          [id]: {
                            pelinAika: new Date().toISOString(),
                            profit: profit,
                          },
                        };
                        await update(userRef, {
                          peliHistoria: newPeliHistoria,
                        });

                        setEndGame(true);
                        inGame(false);
                      } else {
                        Alert.alert(
                          "Virhe",
                          "Syötä kelvollinen numeromuotoinen arvo chippien rahalliselle arvolle."
                        );
                      }
                    } else {
                      Alert.alert(
                        "Virhe",
                        "Chippien rahallinen arvo ei voi olla tyhjä."
                      );
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  // Poistu pelistä
  const leaveGame = () => {
    // Tehdään pelaajan tallennukset ennen kuin siirretään pelaaja takaisin aloitus näkymään
    // AsyncStorage
    AsyncStorage.removeItem("@game");
    GameOnline(null);
  };
  // Fetch session ID
  const fetchSessionId = async () => {
    const id = await AsyncStorage.getItem("@game");
    setSessionId(id);
  };
  // Tarkistetaan pelin lopetus mahdollisuus
  const checkEnd = async () => {
    // Haetaan data
    const id = await AsyncStorage.getItem("@game");
    const pelaajatRef = ref(database, `pelit/${id}/pelaajat`);

    onValue(pelaajatRef, (snap) => {
      const pelaajat = snap.val();
      //console.log(pelaajat);
      if (!pelaajat || Object.keys(pelaajat).length === 0) {
        setEndGame(true);
      }
    });
  };

  useEffect(() => {
    fetchSessionId();
    checkEnd();
  }, []);

  // Handle Buy In
  const HandleBuyIn = (buyIn) => {
    Alert.alert(
      "Vahvista",
      `Olet ottamassa lisää sisäänostoa ${buyIn}€ edestä, oletko varma tästä?`,
      [
        {
          text: "En",
          onPress: () => console.log("BuyIn peruutettu"),
          style: "cancel",
        },
        {
          text: "Kyllä",
          onPress: async () => {
            const id = await AsyncStorage.getItem("@game");
            const pelaajatRef = ref(
              database,
              `pelit/${id}/pelaajat/${auth.currentUser.uid}`
            );
            const pelaajaSnap = await get(pelaajatRef);
            const pelaajaData = pelaajaSnap.val();
            // Lisätään buyIn tietokantaan
            pelaajaData.buyIn += buyIn;
            await update(pelaajatRef, pelaajaData);

            // Päivitä kokonaisRahamaara tieto
            const kokonaisRahamaaraRef = ref(
              database,
              `pelit/${sessionId}/kokonaisRahamaara`
            );
            const newKokonaisRahamaara =
              (gameSessionData.kokonaisRahamaara || 0) + buyIn;

            await set(kokonaisRahamaaraRef, newKokonaisRahamaara);

            // Päivitetään paikallinen
            setGameSessionData((prev) => ({
              ...prev,
              kokonaisRahamaara: prev.kokonaisRahamaara,
            }));
          },
        },
      ]
    );
  };
  // Päivitä peli-istunnon tiedot
  const updateGameSessionData = async () => {
    const id = await AsyncStorage.getItem("@game");
    const gameSessionRef = ref(database, `pelit/${id}`);
    onValue(gameSessionRef, (snapshot) => {
      setGameSessionData(snapshot.val());
    });
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
          <View>
            {/* Title */}
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>PokerNoter</Text>
            {/* TIMER */}
            <Text style={{ fontSize: 14, fontWeight: "light" }}>hh:mm:ss</Text>
          </View>
          {/* QR-koodi */}
          <Modal
            visible={showQr}
            transparent={true}
            onRequestClose={HandleShare}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
              activeOpacity={1}
              onPressOut={() => HandleShare()}
            >
              <View pointerEvents="none">
                <QRCode
                  value={sessionId}
                  size={200} // muuta tämä koko haluamaksesi
                  bgColor="black"
                  fgColor="white"
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Share BTN */}
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            {/* QR-koodi */}
            <TouchableOpacity onPress={() => HandleShare()}>
              <MaterialCommunityIcons name="qrcode" size={40} color="black" />
            </TouchableOpacity>
            {/* ID */}
            <Text style={{ fontSize: 12, fontWeight: "light" }}>
              {sessionId}
            </Text>
          </View>
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
              {gameSessionData && gameSessionData.pelaajat
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
        {/* Pikanäppäimet Buy In:n ottamiseen Salkusta. */}
        <Text style={{ fontSize: 16, marginTop: 10 }}>Lisää sisäänostoasi</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
            alignItems: "center",
          }}
        >
          {/* 5e */}
          <TouchableOpacity
            onPress={() => HandleBuyIn(5)}
            style={{
              backgroundColor: "#F99B7D",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text>5€</Text>
          </TouchableOpacity>
          {/* 10e */}
          <TouchableOpacity
            onPress={() => HandleBuyIn(10)}
            style={{
              backgroundColor: "violet",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text>10€</Text>
          </TouchableOpacity>
          {/* 20e */}
          <TouchableOpacity
            onPress={() => HandleBuyIn(20)}
            style={{
              backgroundColor: "#FFB84C",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text>20€</Text>
          </TouchableOpacity>
          {/* 30e */}
          <TouchableOpacity
            onPress={() => HandleBuyIn(30)}
            style={{
              backgroundColor: "#1B9C85",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text>30€</Text>
          </TouchableOpacity>
        </View>
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
        <ScrollView keyExtractor={(item, index) => index.toString()}>
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

        {/* Poistu pelistä painike */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {endGame ? (
            <>
              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  borderColor: "black",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
                onPress={() => leaveGame()}
              >
                <Text style={{ fontSize: 14 }}>Lopeta peli</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  borderColor: "black",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
                onPress={() => goWaitingMode()}
              >
                <Text style={{ fontSize: 14 }}>Poistu pöydästä</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;
