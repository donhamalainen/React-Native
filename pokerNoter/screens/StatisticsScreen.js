import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

// CustomGraph
import CustomGraph from "../components/CustomGraph";

// Firebase
import { database, auth } from "../config/firebaseConfig";
import { ref, onValue } from "firebase/database";

const testGameData = [
  { dataID: 1, profit: 8.2 },
  { dataID: 2, profit: 13.4 },
  { dataID: 3, profit: 2.8 },
  { dataID: 4, profit: -1.4 },
  { dataID: 5, profit: 5.7 },
  { dataID: 6, profit: 14.1 },
  { dataID: 7, profit: 4.6 },
  { dataID: 8, profit: 2.4 },
  { dataID: 9, profit: 6.7 },
  { dataID: 10, profit: 200.6 },
  { dataID: 11, profit: 24.6 },
  { dataID: 12, profit: 120.6 },
  { dataID: 13, profit: 20.6 },
];

const StatisticsScreen = () => {
  // Variables
  const [peliHistoria, setPeliHistoria] = useState([]);

  useEffect(() => {
    // Fetch data from Firebase or use test data
    setPeliHistoria(testGameData);
    // Uncomment the following lines to fetch data from Firebase
    // const fetchHistory = async () => {
    //   const history = await fetchGameHistory(auth.currentUser.uid);
    //   setPeliHistoria(history);
    // };
    // fetchHistory();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>StatisticsScreen</Text>
        <View>
          <CustomGraph gameHistory={peliHistoria} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StatisticsScreen;
