// Expo
import { StatusBar } from "expo-status-bar";
// React Native
import { ActivityIndicator, View, Text } from "react-native";
import React, { useState } from "react";

// Screens
import AuthNav from "./AuthNav";
import UserNav from "./UserNav";
// useAuth
import { useAuth } from "../config/useAuth";
const index = () => {
  const { user, isLoading } = useAuth();
  const [gameOnline, setGameOnline] = useState(false);

  // Waiting for user data loading or not
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ paddingVertical: 20 }}>Loading...</Text>
      </View>
    );
  }
  // MAIN
  return (
    <>
      <StatusBar style="auto" />
      {user ? <UserNav /> : <AuthNav />}
    </>
  );
};

export default index;
