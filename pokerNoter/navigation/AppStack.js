import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Navigation TAB
const Tab = createBottomTabNavigator();

// SCREEN
import HubScreen from "../screens/HubScreen";
import StatisticsScreen from "../screens/StatisticsScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Icons
import { MaterialCommunityIcons } from "react-native-vector-icons";
const AppStack = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
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
        component={HubScreen}
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
      />
      {/* PROFIILI */}
      <Tab.Screen
        name="Profiili"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ size }) => (
            <MaterialCommunityIcons name="account" size={size} color="white" />
          ),
          tabBarStyle: { backgroundColor: "#212A3E" },
          tabBarLabelStyle: { color: "white" },
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
