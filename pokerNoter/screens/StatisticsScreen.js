import { View, Text, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState } from "react";

// Context
import { AuthContext } from "../context/AuthContext";
// CustomGraph
import CustomGraph from "../components/CustomGraph";

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
  let voittoProsentti;
  let isoinVoitto;

  // JOS pelejä on 0, niin näytetään oletusarvot
  if (pelatutPelit > 0) {
    voittoProsentti = ((voitetutPelit / pelatutPelit) * 100).toFixed(1);
    isoinVoitto = Math.max(...profit);
  } else {
    voittoProsentti = 100;
    isoinVoitto = 0;
  }

  //console.log(voittoProsentti);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
