import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Navigation TAB
const Tab = createBottomTabNavigator();

// SCREEN
import HubScreen from "../screens/HubScreen";
import StatisticsScreen from "../screens/StatisticsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import GameScreen from "../screens/GameScreen";
import TransferScreen from "../screens/TransferScreen";
// Icons
import { MaterialCommunityIcons } from "react-native-vector-icons";
// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
// Alert
import { Alert } from "react-native";
// Firebase
import { database, auth } from "../config/firebaseConfig";
import { ref, get } from "firebase/database";
const AppStack = () => {
  const [gameOnline, setGameOnline] = useState(null);
  const [inGame, setInGame] = useState(true);
  // Tarkistetaan onko pelaaja liittynyt jo peliin.
  const CheckStatus = async () => {
    const sessionID = await AsyncStorage.getItem("@game").catch((err) =>
      Alert.alert("Virhe", err)
    );
    if (sessionID) {
      setGameOnline(sessionID);
    }

    // Tarkistetaan onko pelaaja vielä osa peliä vai onko hän vain tarkkailija
    const sessionRef = ref(database, `pelit/${sessionID}/pelaajat`);
    const snapshot = await get(sessionRef);
    const pelaaja = snapshot.val();
    if (!pelaaja || !pelaaja[auth.currentUser.uid]) {
      setInGame(false);
    }
  };

  useEffect(() => {
    CheckStatus();
  }, []);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {gameOnline === null ? (
        <>
          {/* ALOITUSNÄKYMÄ */}
          <Tab.Screen
            name="Aloitusnäkymä"
            component={StatisticsScreen}
            options={{
              tabBarIcon: ({ size }) => (
                <MaterialCommunityIcons
                  name="chart-areaspline"
                  size={size}
                  color="white"
                />
              ),
              tabBarStyle: { backgroundColor: "#212A3E" },
              tabBarLabelStyle: { color: "white" },
              tabBarShowLabel: false,
            }}
          />
          {/* MAIN */}
          <Tab.Screen
            name="Päänäkymä"
            options={{
              tabBarIcon: ({ size }) => (
                <MaterialCommunityIcons
                  name="plus-box"
                  size={size + 20}
                  color="white"
                />
              ),
              tabBarStyle: { backgroundColor: "#212A3E" },
              tabBarLabelStyle: { color: "white" },
              tabBarShowLabel: false,
            }}
          >
            {() => <HubScreen GameOnline={setGameOnline} />}
          </Tab.Screen>
          {/* PROFIILI */}
          <Tab.Screen
            name="Profiili"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ size }) => (
                <MaterialCommunityIcons
                  name="account"
                  size={size}
                  color="white"
                />
              ),
              tabBarStyle: { backgroundColor: "#212A3E" },
              tabBarLabelStyle: { color: "white" },
              tabBarShowLabel: false,
            }}
          />
        </>
      ) : (
        <>
          {inGame ? (
            <>
              <Tab.Screen
                name="Game"
                options={{
                  tabBarIcon: ({ size }) => (
                    <MaterialCommunityIcons
                      name="poker-chip"
                      size={size}
                      color="white"
                    />
                  ),
                  tabBarStyle: { backgroundColor: "#212A3E" },
                  tabBarLabelStyle: { color: "white" },
                  tabBarShowLabel: false,
                }}
              >
                {() => (
                  <GameScreen GameOnline={setGameOnline} inGame={setInGame} />
                )}
              </Tab.Screen>

              <Tab.Screen
                name="Transfer"
                options={{
                  tabBarIcon: ({ size }) => (
                    <MaterialCommunityIcons
                      name="transfer"
                      size={size}
                      color="white"
                    />
                  ),
                  tabBarStyle: { backgroundColor: "#212A3E" },
                  tabBarLabelStyle: { color: "white" },
                  tabBarShowLabel: false,
                }}
              >
                {() => <TransferScreen />}
              </Tab.Screen>
            </>
          ) : (
            <>
              <Tab.Screen
                name="Game"
                options={{
                  tabBarIcon: ({ size }) => (
                    <MaterialCommunityIcons
                      name="poker-chip"
                      size={size}
                      color="white"
                    />
                  ),
                  tabBarStyle: { backgroundColor: "#212A3E" },
                  tabBarLabelStyle: { color: "white" },
                  tabBarShowLabel: false,
                }}
              >
                {() => (
                  <GameScreen GameOnline={setGameOnline} inGame={setInGame} />
                )}
              </Tab.Screen>
            </>
          )}
        </>
      )}
    </Tab.Navigator>
  );
};

export default AppStack;
