import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";

// CustomGraph
import CustomGraph from "../components/CustomGraph";

// Firebase
import { database, auth } from "../config/firebaseConfig";
import { ref, onValue, get } from "firebase/database";

/*
const testGameData = [
  { dataID: 1, profit: 15.2 },
  { dataID: 2, profit: -20.1 },
  { dataID: 3, profit: -30.5 },
  { dataID: 4, profit: -10.5 },
  { dataID: 5, profit: -15.2 },
  { dataID: 6, profit: -18.1 },
  { dataID: 7, profit: 22.5 },
  { dataID: 8, profit: 20.2 },
  { dataID: 9, profit: 15.5 },
  { dataID: 10, profit: 18.2 },
  { dataID: 11, profit: -98.7 },
  { dataID: 12, profit: 19.8 },
  { dataID: 13, profit: 15.2 },
  { dataID: 14, profit: 16.4 }, 
  { dataID: 15, profit: 20.2 },
  { dataID: 16, profit: 10.5 },
  { dataID: 17, profit: 20.1 },
  { dataID: 18, profit: -2.3 },
  { dataID: 19, profit: -16.7 },
  { dataID: 20, profit: -25.5 },
];
*/

const StatisticsScreen = () => {
  // Variables
  const [peliHistoria, setPeliHistoria] = useState([]);

  // Haetaan firebase Data
  const fetchGameHistory = async () => {
    const gameHistoryRef = ref(
      database,
      `kayttajat/${auth.currentUser.uid}/peliHistoria`
    );
    onValue(gameHistoryRef, (snap) => {
      const data = snap.val();
      // console.log(Object.values(data));
      setPeliHistoria(Object.values(data));
    });
  };
  useEffect(() => {
    fetchGameHistory();
  }, []);

  // Voittoprosentti laskenta
  const pelatutPelit = peliHistoria.length;
  const voitetutPelit = peliHistoria.filter((game) => game.profit > 0).length;
  const voittoProsentti = (voitetutPelit / pelatutPelit) * 100;
  //console.log(voittoProsentti);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#212A3E",
            borderRadius: 20,
          }}
        ></View>
        <View style={{ flex: 2 }}>
          <CustomGraph gameHistory={peliHistoria} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StatisticsScreen;
