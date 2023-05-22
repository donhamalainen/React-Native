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
// LOTTIE, TÄSSÄ ON BUGI ANDROIDILLE
import LottieView from "lottie-react-native";
// Icons
import { MaterialCommunityIcons } from "react-native-vector-icons";

const RegisterScreen = ({ navigation }) => {
  const { Register } = useContext(AuthContext);
  const [hide, setHide] = useState(true);
  const [confirmHide, setConfirmHide] = useState(true);

  // FIELDS
  const [firstName, setFirstName] = useState(null);
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
            {/* REKISTERÖINTI */}
            <View>
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
                value={firstName}
                onChangeText={(name) => setFirstName(name)}
                autoCorrect={false}
                placeholder="Syötä etunimesi"
                autoCapitalize="none"
              />
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
                  secureTextEntry={confirmHide}
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
              {/* Rekisteröidy-painike */}
              <TouchableOpacity
                onPress={() =>
                  Register(firstName, email, password, confirmPassword)
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
                <Text style={{ color: "black" }}>Oletko jo osa meitä? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={{ color: "#AC1010", fontWeight: "700" }}>
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
    borderRadius: 10,
  },
  eye: {
    padding: 20,
  },
});
