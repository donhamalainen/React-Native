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

const RegisterScreen = ({ navigation }) => {
  const { isLoading, Register } = useContext(AuthContext);
  const [hide, setHide] = useState(true);
  const [confirmHide, setConfirmHide] = useState(true);

  // FIELDS
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

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
                source={require("../assets/animations/registerLottie.json")}
                autoPlay
                loop={true}
                style={{
                  alignSelf: "center",
                  width: 200,
                  height: 200,
                }}
              />
            </View>
            {/* REKISTERÖINTI */}
            <View style={{ flex: "auto" }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  marginBottom: 30,
                  color: "#333",
                }}
              >
                Rekisteröidy
              </Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(email) => setEmail(email)}
                autoCorrect={false}
                placeholder="Syötä sähköpostiosoite"
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
                  placeholder="Syötä salasana"
                  textContentType="password"
                />
                <TouchableOpacity onPress={() => setHide(!hide)}>
                  {hide ? (
                    <MaterialCommunityIcons
                      style={styles.eye}
                      name="eye-outline"
                      color="black"
                      size={24}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      style={styles.eye}
                      name="eye-off-outline"
                      color="black"
                      size={24}
                    />
                  )}
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={confirmPassword}
                  onChangeText={(pass) => setConfirmPassword(pass)}
                  secureTextEntry={hide}
                  placeholder="Syötä salasana uudelleen"
                  textContentType="password"
                />
                <TouchableOpacity onPress={() => setConfirmHide(!confirmHide)}>
                  {confirmHide ? (
                    <MaterialCommunityIcons
                      style={styles.eye}
                      name="eye-outline"
                      color="black"
                      size={24}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      style={styles.eye}
                      name="eye-off-outline"
                      color="black"
                      size={24}
                    />
                  )}
                </TouchableOpacity>
              </View>
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
                  Rekisteröidy
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
                <Text style={{ color: "black" }}>Oletko jo osa mietä?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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

export default RegisterScreen;

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
