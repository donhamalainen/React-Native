import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const HomeScreen = () => {
  const { Logout } = useContext(AuthContext);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "coral" }}>
      <View>
        <Text>HomeScreen</Text>
        <TouchableOpacity onPress={() => Logout()}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
