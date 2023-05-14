import React, { useContext } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Platform,
  View,
  StatusBar,
} from "react-native";

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
      <View style={styles.container}>
        {userToken !== null ? <AppStack /> : <AuthStack />}
      </View>
    </NavigationContainer>
  );
};

export default RootNavigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
  },
});
