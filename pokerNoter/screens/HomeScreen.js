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
// CONTEXT
import { AuthContext } from "../context/AuthContext";
// ID GENERATION
import { generate } from "shortid";

const HomeScreen = ({ navigation }) => {
  const { Logout } = useContext(AuthContext);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
