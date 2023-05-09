import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useContext, useState } from "react";

// CONTEXT
import { AuthContext } from "../context/AuthContext";
// LOTTIE
import LottieView from "lottie-react-native";
// Icons
import { MaterialCommunityIcons } from "react-native-vector-icons";

const ForgetPasswordScreen = ({ navigation }) => {
  const { resetPassword } = useContext(AuthContext);
  const [email, setEmail] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 25,
            }}
          >
            {/* LOTTIE */}
            <View style={{ flex: 1.5, justifyContent: "center" }}>
              <LottieView
                source={require("../assets/animations/resetPassword.json")}
                autoPlay
                loop={false}
                style={{
                  alignSelf: "center",
                  width: 150,
                  height: 150,
                }}
              />
            </View>

            {/* UNOHTUIKO SALASANA? */}
            <View style={{ flex: 0.5 }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  color: "#333",
                  marginBottom: 30,
                }}
              >
                Unohtuiko salasanasi
              </Text>

              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(email) => setEmail(email)}
                autoCorrect={false}
                placeholder="Syötä sähköpostiosoite"
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
              />
            </View>

            {/* PAINIKKEET */}
            <View style={{ flex: 2, justifyContent: "flex-end" }}>
              {/* Reset-painike */}
              <TouchableOpacity
                onPress={() =>
                  resetPassword(email).then(() => navigation.goBack())
                }
                style={{
                  backgroundColor: "coral",
                  padding: 20,
                  borderRadius: 10,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: 16,
                    color: "white",
                  }}
                >
                  Lähetä palautuspyyntö
                </Text>
              </TouchableOpacity>

              {/* Palaa takaisin-painike */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Text>Muistuiko salasana sittenkin?</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={{ color: "coral", fontWeight: "700" }}>
                    {" "}
                    Kirjaudu
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgetPasswordScreen;
const styles = StyleSheet.create({
  input: {
    padding: 20,
    borderWidth: 2,
    marginVertical: 5,
  },
});