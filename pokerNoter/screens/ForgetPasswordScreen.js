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

const ForgetPasswordScreen = ({ navigation }) => {
  const { resetPassword } = useContext(AuthContext);
  const [email, setEmail] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
            <View style={{ flex: 1, justifyContent: "center" }}>
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
            <View>
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
                onChangeText={(text) => setEmail(text)}
                autoCorrect={false}
                placeholder="Syötä sähköpostiosoite"
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
                underlineColorAndroid="transparent" // Android only: remove bottom line in Android
                returnKeyType="done" // adds "done" button in iOS keyboard
              />
            </View>

            {/* PAINIKKEET */}
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              {/* Reset-painike */}
              <TouchableOpacity
                onPress={() =>
                  resetPassword(email).then(() => navigation.goBack())
                }
                style={{
                  backgroundColor: "#212A3E",
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
                  <Text style={{ color: "#AC1010", fontWeight: "700" }}>
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
    borderRadius: 10,
  },
});
