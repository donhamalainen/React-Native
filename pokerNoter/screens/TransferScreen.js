import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import Dialog from "react-native-dialog";
import React, { useState, useEffect } from "react";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
// Icons
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// Firebase
import { database, auth } from "../config/firebaseConfig";
import { get, ref, remove, set, onValue, update } from "firebase/database";

const TransferScreen = () => {
  // Peli-istunnon tiedot
  const [gameSessionData, setGameSessionData] = useState(null);
  const [currentPelaaja, setCurrentPelaaja] = useState(undefined);
  const [targetPelaaja, setTargetPelaaja] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [toggler, setToggler] = useState(false); // False == Minä olen ostaja -> True == Minä olen myyjä
  // Päivitä peli-istunnon tiedot
  const updateGameSessionData = async () => {
    const id = await AsyncStorage.getItem("@game");
    const gameSessionRef = ref(database, `pelit/${id}`);
    onValue(gameSessionRef, (snapshot) => {
      setGameSessionData(snapshot.val());
      setCurrentPelaaja(
        snapshot.val().pelaajat[auth.currentUser.uid].nimi || undefined
      );
    });
  };

  // Hae tiedot, kun komponentti ladataan ja päivitä niitä muutosten yhteydessä
  useEffect(() => {
    updateGameSessionData();
  }, []);
  // TransferHandler
  const HandleTransfer = () => {
    if (targetPelaaja === "Pelaaja" || targetPelaaja === null) {
      Alert.alert(
        "Yritä edes",
        "Sinun tulee valita pelaaja jonka kanssa teet siirron"
      );
    } else {
      Alert.alert("Vahvista", "Haluatko vahvistaa siirron", [
        {
          text: "En",
          onPress: () => console.log("Vahvistus peruttu"),
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

            // Jos pelaajalla on Android
            if (Platform.OS === "android") {
              setDialogVisible(true);
            } else {
              Alert.prompt("");
            }
          },
        },
      ]);
    }
  };
  // ANDROID HANDLER
  const AndroidHandler = () => {
    console.log("AndroidHandler");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* CONTAINER */}
      <View style={{ flex: 1, paddingHorizontal: 25 }}>
        {/* HEADER */}
        <View>
          {/* Title */}
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>PokerNoter</Text>
          {/* Description */}
          <Text
            style={{
              fontSize: 16,
              fontStyle: "italic",
              marginTop: 10,
              color: "gray",
            }}
          >
            "Täällä voit tehdä pelaajien välisiä pelimerkki ostoja"
          </Text>
        </View>

        {/* OSTO / MYYNTI ALUE */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 40,
            justifyContent: "space-between",
          }}
        >
          {/* OSTAJA */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Text>Ostaja</Text>
            <View
              style={{
                width: 100,
                alignItems: "center",
                borderRadius: 10,
                paddingHorizontal: 20,
                paddingVertical: 10,
                backgroundColor: "coral",
              }}
            >
              <Text>
                {toggler ? targetPelaaja || "Pelaaja" : currentPelaaja}
              </Text>
            </View>
          </View>

          {/* ICON */}
          <View>
            <TouchableOpacity onPress={() => setToggler(!toggler)}>
              <MaterialCommunityIcons name="swap-horizontal" size={46} />
            </TouchableOpacity>
          </View>

          {/* MYYJÄ */}
          <View
            style={{ flexDirection: "column", alignItems: "center", gap: 20 }}
          >
            <Text>Myyjä</Text>
            <View
              style={{
                width: 100,
                alignItems: "center",
                borderRadius: 10,
                paddingHorizontal: 20,
                paddingVertical: 10,
                backgroundColor: "violet",
              }}
            >
              <Text>
                {toggler ? currentPelaaja : targetPelaaja || "Pelaaja"}
              </Text>
            </View>
          </View>
        </View>

        {/* PELAAJA LISTA ILMAN OMAA NIMEÄ */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 40,
            paddingBottom: 10,
            alignItems: "center",
            borderBottomWidth: 2,
            width: "100%",
            borderColor: "gray",
          }}
        >
          <View style={{}}>
            <Text style={{ fontSize: 20, marginBottom: 5 }}>
              Valitse seuraavista pelaajista
            </Text>
            <Text style={{ fontSize: 16, color: "gray" }}>
              Voit valita pelaajan klikkaamalla
            </Text>
          </View>
        </View>
        <ScrollView keyExtractor={(item, index) => index.toString()}>
          {/* Aktiiviset pelaajat */}
          {gameSessionData &&
            gameSessionData.pelaajat &&
            Object.entries(gameSessionData.pelaajat).map(([key, pelaaja]) => {
              if (pelaaja.nimi !== currentPelaaja) {
                return (
                  /* Mahdollistetaan pelaajan nimen painaminen, jotta se tulee tyhjään kohtaan */
                  <TouchableOpacity
                    style={{
                      paddingVertical: 10,
                    }}
                    key={key}
                    onPress={() => setTargetPelaaja(pelaaja.nimi)}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
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
                  </TouchableOpacity>
                );
              } else {
                return null;
              }
            })}
        </ScrollView>

        {/* PAINIKKEET */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* ANDROID ALERT */}
          <Dialog.Container visible={dialogVisible}>
            <Dialog.Title>
              {toggler
                ? `Paljonko haluat myydä pelimerkkejä pelaajalle - ${targetPelaaja}`
                : `Paljonko haluat ostaa pelimerkkejä pelaajalta - ${targetPelaaja}`}
            </Dialog.Title>
            <Dialog.Input onChangeText={(value) => setChipAmount(value)} />
            <Dialog.Button
              label="Peruuta"
              onPress={() => setDialogVisible(false)}
            />
            <Dialog.Button label="Vahvista" onPress={() => AndroidHandler()} />
          </Dialog.Container>
          <TouchableOpacity
            style={{
              borderWidth: 2,
              borderColor: "black",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
            }}
            onPress={() => HandleTransfer()}
          >
            <Text style={{ fontSize: 14 }}>Vahvista siirto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TransferScreen;
