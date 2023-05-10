import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React from "react";
// Custom graphics
import CustomGraph from "../components/CustomGraph";
// Firebase
import { database, auth } from "../config/firebaseConfig";

const ProfileScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>ProfileScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
