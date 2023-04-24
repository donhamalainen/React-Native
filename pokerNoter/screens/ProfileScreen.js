import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

// Firebase
import { SignOut, database, auth } from "../config/firebaseConfig";
import { onValue, ref } from "firebase/database";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
// SCREENS
import CharDisplay from "../components/charDisplay";
const ProfileScreen = () => {
  const [nimi, setNimi] = useState(null);
  const [sukunimi, setSukunimi] = useState(null);
  // EI ASETETTU
  const [pelatutYhteensa, setPelatutYhteensa] = useState(null);
  const [yhteenVeto, setYhteenVeto] = useState(null);
  const [pelatutPelit, setPelatutPelit] = useState([null]);
  // EI ASETETTU END
  // Database fetching
  const fetchUserData = async () => {
    try {
      const urlName = await ref(
        database,
        `kayttaja/${auth.currentUser.uid}/nimi`
      );
      const urlLastname = await ref(
        database,
        `kayttaja/${auth.currentUser.uid}/sukunimi`
      );
      const urlPlayedTotal = await ref(
        database,
        `kayttaja/${auth.currentUser.uid}/pelatutYhteensa`
      );
      const urlYhteenveto = await ref(
        database,
        `kayttaja/${auth.currentUser.uid}/yhteenVeto`
      );
      const urlPlayedGamesList = await ref(
        database,
        `kayttaja/${auth.currentUser.uid}/pelatutPelit`
      );
      await onValue(urlName, (snap) => {
        setNimi(snap.val());
      });
      await onValue(urlLastname, (snap) => {
        setSukunimi(snap.val());
      });
      await onValue(urlPlayedTotal, (snap) => {
        setPelatutYhteensa(snap.val());
      });
      await onValue(urlYhteenveto, (snap) => {
        setYhteenVeto(snap.val());
      });
      await onValue(urlPlayedGamesList, (snap) => {
        setPelatutPelit(snap.val());
      });
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.HeaderContainer}>
          <Text style={{ fontSize: 24, fontWeight: 300 }}>Mahtavaa nähdä,</Text>
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 28 }}>
              {nimi !== null ? nimi : ""}{" "}
              {sukunimi !== null ? sukunimi + "🔥" : "Pelaaja 200"}
            </Text>
          </View>
        </View>

        <View style={styles.statistiikkaContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.statisText}>Pelattuja pelejä: </Text>
            <Text style={styles.number}>
              {pelatutYhteensa !== null
                ? pelatutYhteensa
                : "Lataaminen epäonnistui"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.statisText}>Yhteenveto: </Text>
            <Text style={styles.number}>
              {yhteenVeto !== null ? yhteenVeto : "Lataaminen epäonnistui"}
            </Text>
          </View>
        </View>

        <CharDisplay data={{ yhteenVeto, pelatutYhteensa, pelatutPelit }} />
        <TouchableOpacity style={styles.SignOut} onPress={SignOut}>
          <Text style={{ fontSize: 18, fontWeight: 300 }}>Kirjaudu ulos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  // Statistiiikka Container
  statistiikkaContainer: {
    backgroundColor: "#FFD3C2",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    minHeight: 100,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  statisText: {
    fontSize: 16,
    fontWeight: 300,
  },
  number: {
    fontSize: 20,
    fontWeight: 300,
  },
  SignOut: {
    position: "absolute",
    bottom: 60,
    right: 20,
    backgroundColor: "#FFD3C2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});
