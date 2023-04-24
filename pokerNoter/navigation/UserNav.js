import React, { useEffect, useState } from "react";
// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

// Screens
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Icons
import { MaterialCommunityIcons } from "react-native-vector-icons";
import GameScreen from "../screens/GameScreen";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
const UserNav = () => {
  const [gameOnline, setGameOnline] = useState(false);
  const [gameID, setGameID] = useState(null);

  // Check if the user is already in the game
  const checkGameStatus = async () => {
    await AsyncStorage.getItem("@game").then((gameData) => {
      if (gameData !== null) {
        setGameID(gameData);
        setGameOnline(true);
      }
    });
  };
  useEffect(() => {
    checkGameStatus();
  }, [gameOnline, gameID]);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        {gameOnline ? (
          <Tab.Screen
            name="GameScreen"
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="account"
                  size={size}
                  color={color}
                />
              ),
            }}
          >
            {() => <GameScreen gameStatus={setGameOnline} gameID={gameID} />}
          </Tab.Screen>
        ) : (
          <>
            <Tab.Screen
              name="Home"
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="nintendo-game-boy"
                    color={color}
                    size={size}
                  />
                ),
              }}
            >
              {() => <HomeScreen gameStatus={setGameOnline} />}
            </Tab.Screen>
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="account"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default UserNav;
