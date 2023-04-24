import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { VictoryLine, VictoryChart, VictoryTheme } from "victory-native";

const charDisplay = ({ data }) => {
  const { yhteenVeto, pelatutYhteensa, pelatutPelit } = data;
  //console.log(yhteenVeto, pelatutYhteensa);

  let winRation = 0;
  if (pelatutYhteensa > 0) {
    winRation = (yhteenVeto / pelatutYhteensa) * 100;
  }
  // Tarkistetaan, onko pelattujen pelien ja yhteenvedon arvot saatavilla
  if (pelatutYhteensa === null || yhteenVeto === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Ladataan graafia...</Text>
      </View>
    );
  }

  // Jos pelaaja on vasta aloittanut, antaa viestin käyttäjälle
  if (pelatutYhteensa === 0 && yhteenVeto === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Pelattuja pelejä ja yhteenvetoa ei ole vielä saatavilla.
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine
          data={[
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 3 },
            { x: 4, y: 4 },
            { x: 5, y: 5 },
          ]}
        />
      </VictoryChart>
    </View>
  );
};

export default charDisplay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "300",
  },
});
