import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

const GameScreen = ({ GameOnline }) => {
  const [inGame, setInGame] = useState(true);
  // Siirry odotustilaan
  const goWaitingMode = () => {
    GameOnline(null);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, paddingHorizontal: 25 }}>
        <Text>GameScreen</Text>
        <TouchableOpacity onPress={() => goWaitingMode()}>
          <Text>Siirry odotustilaan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;
