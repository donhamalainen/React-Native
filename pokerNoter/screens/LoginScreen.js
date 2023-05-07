import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, useState } from "react";
// CONTEXT
import { AuthContext } from "../context/AuthContext";
// LOTTIE
import LottieView from "lottie-react-native";
// Icons
import { MaterialCommunityIcons } from "react-native-vector-icons";

const LoginScreen = ({ navigation }) => {
  const { Login } = useContext(AuthContext);
  // HIDE PASSWORDS
  const [hide, setHide] = useState(true);
  // FIELDS
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

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
            <View style={{ flex: 1.5, justifyContent: "center" }}>
              <LottieView
                source={require("../assets/animations/loginLottie.json")}
                autoPlay
                loop={false}
                style={{
                  alignSelf: "center",
                  width: 200,
                  height: 200,
                }}
              />
            </View>
            {/* KIRJAUTUMINEN */}
            <View style={{ flex: "auto" }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  color: "#333",
                  marginBottom: 30,
                }}
              >
                Kirjaudu
              </Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(email) => setEmail(email)}
                autoCorrect={false}
                placeholder="Sähköpostiosoite"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                keyboardType="email-address"
              />

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={(pass) => setPassword(pass)}
                  secureTextEntry={hide}
                  placeholder="Salasana"
                  textContentType="password"
                />
                <TouchableOpacity onPress={() => setHide(!hide)}>
                  {hide ? (
                    <MaterialCommunityIcons
                      style={styles.eye}
                      name="eye-outline"
                      size={24}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      style={styles.eye}
                      name="eye-off-outline"
                      size={24}
                    />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => console.log("Pressed")}>
                <Text style={{ fontSize: 12, color: "blue", marginTop: 10 }}>
                  Unohditko salasanasi?
                </Text>
              </TouchableOpacity>
            </View>

            {/* PAINIKKEET */}
            <View style={{ flex: 2, justifyContent: "flex-end" }}>
              {/* Kirjaudu-painike */}
              <TouchableOpacity
                onPress={() => Login(email, password)}
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
                  Kirjaudu
                </Text>
              </TouchableOpacity>

              {/* Rekisteröidy-painike */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Text>Oletko uusi täällä?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={{ color: "coral", fontWeight: "700" }}>
                    {" "}
                    Rekisteröidy
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

export default LoginScreen;

const styles = StyleSheet.create({
  input: {
    padding: 20,
    borderWidth: 2,
    marginVertical: 5,
  },
  eye: {
    padding: 20,
  },
});
