import { View, Text, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState } from "react";

// Context
import { AuthContext } from "../context/AuthContext";
// CustomGraph
import CustomGraph from "../components/CustomGraph";

// Firebase
import { database, auth } from "../config/firebaseConfig";
import { ref, onValue } from "firebase/database";

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
  const { data } = useContext(AuthContext);

  useEffect(() => {
    if (data && data.peliHistoria) {
      setPeliHistoria(Object.values(data.peliHistoria));
    }
  }, [data]);

  // LASKENTOJA
  // VAKIO HAKEE PROFIITIT
  const profit = peliHistoria.map((game) => game.profit);

  const pelatutPelit = peliHistoria.length;
  const voitetutPelit = peliHistoria.filter((game) => game.profit > 0).length;
  const voittoProsentti = ((voitetutPelit / pelatutPelit) * 100).toFixed(1);
  const isoinVoitto = Math.max(...profit);
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
            padding: 20,
            marginBottom: 20,
            backgroundColor: "#212A3E",
            borderRadius: 20,
          }}
        >
          {/* Pelatut pelit */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Olet pelannut</Text>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              {pelatutPelit} peliä
            </Text>
          </View>
          {/* Voittoprosentti */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 18 }}>
              Voittoprosentti
            </Text>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              {voittoProsentti}%
            </Text>
          </View>
          {/* isoinVoitto */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Isoin voittosi</Text>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              {isoinVoitto} €
            </Text>
          </View>
        </View>
        <View style={{ flex: 2 }}>
          <CustomGraph gameHistory={peliHistoria} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StatisticsScreen;
