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

const AppStack = () => {
  const [gameOnline, setGameOnline] = useState(null);

  // Check if the user already in the online
  useEffect(() => {
    AsyncStorage.getItem("@game")
      .then((gameId) => {
        if (gameId) {
          setGameOnline(gameId);
        }
      })
      .catch((err) => {
        Alert.alert("Virhe", err.message);
      });
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
          {gameOnline ? (
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
                {() => <GameScreen GameOnline={setGameOnline} />}
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
                {() => <GameScreen GameOnline={setGameOnline} />}
              </Tab.Screen>
            </>
          )}
        </>
      )}
    </Tab.Navigator>
  );
};

export default AppStack;
