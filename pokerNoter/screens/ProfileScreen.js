import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

// Firebase
import { SignOut, database } from "../config/firebaseConfig";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
const ProfileScreen = () => {
  const [nimi, setNimi] = useState("");
  // EI ASETETTU
  const [pelatutPelit, setPelatutPelit] = useState(0);
  const [yhteenVeto, setYhteenVeto] = useState(0);
  // EI ASETETTU END

  const haetaanNimi = async (userId) => {
    try {
      database
        .ref(`kayttaja/${userId}/nimi`)
        .once("value")
        .then((snapshot) => {
          setNimi = snapshot.val();
          console.log(nimi);
        });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Tervetuloa {nimi}</Text>

        <TouchableOpacity onPress={SignOut}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
