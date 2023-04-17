import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
// Firebase & Config
// Icons
import { MaterialCommunityIcons } from "react-native-vector-icons";
// Firebase
import { SignIn } from "../config/firebaseConfig";
const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [hidePass, setHidePass] = useState(true);

  // Register NAV
  const handleRegisterNav = () => {
    navigation.navigate("Register");
  };
  // Forgot password NAV
  const handleForgotPassword = () => {
    navigation.navigate("Reset");
  };

  // Sign In
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.container}>
            <Text style={styles.title}>PokerNoter</Text>
            <TextInput
              style={styles.input}
              placeholder="Sähköpostiosoite"
              onChangeText={(email) => setEmail(email)}
              value={email}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputPass}
                placeholder="Salasana"
                onChangeText={(password) => setPassword(password)}
                value={password}
                secureTextEntry={hidePass}
                textContentType="password"
              />
              <TouchableOpacity
                style={{ padding: 20, marginRight: 20 }}
                onPress={() => setHidePass(!hidePass)}
              >
                {hidePass ? (
                  <MaterialCommunityIcons name="eye-outline" size={24} />
                ) : (
                  <MaterialCommunityIcons name="eye-off-outline" size={24} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text
                style={{
                  fontSize: 12,
                  paddingHorizontal: 20,
                  color: "blue",
                  marginBottom: 20,
                }}
              >
                Unohditko salasanasi?
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                padding: 20,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={() => SignIn(email, password)}
              >
                <Text style={styles.buttonText}>Kirjaudu sisään</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleRegisterNav}
              >
                <Text style={styles.buttonText}>Rekisteröidy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    position: "absolute",
    top: 20,
    fontSize: 48,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  input: {
    padding: 20,
    borderWidth: 2,
    margin: 20,
  },
  inputPass: {
    flex: 1,
    padding: 20,
    borderWidth: 2,
    marginLeft: 20,
  },
  buttonText: {
    fontSize: 16,
  },
  button: {
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});
