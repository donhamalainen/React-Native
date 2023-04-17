import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
// Nav
import { useNavigation } from "@react-navigation/native";
const HomeScreen = () => {
  // Navigation
  const navigation = useNavigation();
  const handleNav = () => {
    navigation.navigate("Profile");
  };
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handleNav}>
        <Text>Profile</Text>
      </TouchableOpacity>
      <View>
        <Text>HomeScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
