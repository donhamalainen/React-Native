import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
// ID GENERATION
import { generate } from "shortid";
// QR Scanner
import { BarCodeScanner } from "expo-barcode-scanner";
// Firebase
import { database, auth } from "../config/firebaseConfig";
import { set, ref, get, child, update } from "firebase/database";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

const HubScreen = ({ GameOnline }) => {
  const [sessionId, setSessionId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState();

  // Create Session
  const createSession = async () => {
    // Generate a new session ID
    const newSessionId = generate();
    setSessionId(newSessionId);

    // Database
    // Fetch user information
    const userRef = ref(database, "kayttajat/" + auth.currentUser.uid);
    const userSnapshot = await get(userRef);
    // Create a new database for game
    const sessionRef = ref(database, "pelit/" + newSessionId);
    await set(sessionRef, {
      id: newSessionId,
      pelaajat: {
        [auth.currentUser.uid]: {
          nimi: userSnapshot.val().nimi,
          peliHistoria: userSnapshot.val().peliHistoria || {},
          buyIn: 0,
        },
      },
      pelinAloitusaika: new Date().getTime(),
      paivaMaara: new Date().toISOString(),
      kokonaisRahamaara: 0,
      poistuneetPelaajat: {},
    })
      .then(() => {
        // AsyncStorage
        AsyncStorage.setItem(`@game`, newSessionId);
        GameOnline(newSessionId);
      })
      .catch((err) => {
        Alert.alert("Virhe", "Pelin luonnissa tapahtui virhe: " + err.message);
      });
  };
  // Join Session
  const joinSession = async () => {
    if (sessionId != null) {
      const sessionRef = ref(database, "pelit/" + sessionId);
      const sessionSnapshot = await get(sessionRef);

      if (sessionSnapshot.exists()) {
        const pelaajatRef = child(sessionRef, "pelaajat");
        const pelaajatSnapshot = await get(pelaajatRef);
        // console.log(pelaajatSnapshot);
        if (pelaajatSnapshot.exists()) {
          const pelaajat = pelaajatSnapshot.val();

          // Fetch user information
          const userRef = ref(database, "kayttajat/" + auth.currentUser.uid);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            pelaajat[auth.currentUser.uid] = {
              nimi: userSnapshot.val().nimi,
              peliHistoria: userSnapshot.val().peliHistoria || {},
              buyIn: 0,
            };

            // Update players list in the database
            await update(sessionRef, { pelaajat });
          } else {
            Alert.alert("Virhe", "Käyttäjätietoja ei löytynyt");
          }
        }
        // AsyncStorage
        AsyncStorage.setItem(`@game`, sessionId);
        GameOnline(sessionId);
      } else {
        Alert.alert("Virhe", "Istuntoa ei löytynyt");
      }
    } else {
      Alert.alert("Virhe", "Istunnon ID ei ole kelvollinen");
    }
  };

  // Handle QR-code
  const handleBarCodeScanned = ({ data }) => {
    setIsScanning(false);
    setSessionId(data);
    joinSession();
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasCameraPermission(status === "granted");
  };

  useEffect(() => {
    if (hasCameraPermission === false) {
      Alert.alert(
        "Kameran käyttöoikeus",
        "Sovellus haluaa käyttää kameraasi QR-koodin lukemiseen, jotta peliin liittyminen olisi nopeampaa",
        [
          {
            text: "Salli",
            onPress: () => requestCameraPermission(),
          },
          {
            text: "Kieltäydy",
            onPress: () => console.log("Kameran käyttöoikeus evätty"),
            style: "cancel",
          },
        ]
      );
    }
  }, [hasCameraPermission]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* Tervetuloa pelit */}
          <View style={{ flex: 1, paddingHorizontal: 25 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              Tervetuloa aulaan.
            </Text>

            {/* PAINIKKEET */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginVertical: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "coral",
                  paddingHorizontal: 40,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
                onPress={() => createSession()}
              >
                <Text style={{ color: "white", fontSize: 18 }}>Luo peli</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "coral",
                  paddingHorizontal: 40,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
                onPress={() => joinSession()}
              >
                <Text style={{ color: "white", fontSize: 18 }}>
                  Liity peliin
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input the id */}
            <View>
              <TextInput
                value={sessionId}
                onChangeText={(text) => setSessionId(text)}
                placeholder="Syötä pelin id liittyäksesi"
                style={{ borderWidth: 2, padding: 20, borderRadius: 10 }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HubScreen;
