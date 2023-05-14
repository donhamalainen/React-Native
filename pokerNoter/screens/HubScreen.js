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
// ID GENERATION
import { generate } from "shortid";

// Firebase
import { database } from "../config/firebaseConfig";
import { set, ref } from "firebase/database";

const HubScreen = ({ GameOnline }) => {
  const [sessionId, setSessionId] = useState("");

  // Create session
  const createSession = () => {
    // Generate a new session ID
    const newSessionId = generate();
    GameOnline(newSessionId);
  };
  // Join session
  const joinSession = () => {
    // TODO: Validate and join the session with the given ID
    console.log("Joining session with ID:", sessionId);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Tervetuloa pelit */}
        <View style={{ flex: 1, paddingHorizontal: 25 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            Tervetuloa aulaan.
          </Text>

          {/* PAINIKKEET */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginVertical: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "coral",
                paddingHorizontal: 40,
                paddingVertical: 10,
                borderRadius: 10,
              }}
              onPress={() => createSession()}
            >
              <Text>Luo peli</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "coral",
                paddingHorizontal: 40,
                paddingVertical: 10,
                borderRadius: 10,
              }}
              onPress={() => joinSession()}
            >
              <Text>Liity peliin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HubScreen;
