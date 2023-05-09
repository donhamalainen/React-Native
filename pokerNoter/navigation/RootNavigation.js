import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
// NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

// CONTEXT
import { AuthContext } from "../context/AuthContext";

const RootNavigation = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  // LOADING...
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color="coral" />
      </View>
    );
  }

  // MAIN...
  return (
    <NavigationContainer>
      {userToken !== null ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigation;
