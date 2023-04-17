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
} from "react-native";
import React, { useState } from "react";
// Navigation
import { useNavigation } from "@react-navigation/native";
// Icons
import { MaterialCommunityIcons } from "react-native-vector-icons";
// Firebase
import { SignUp } from "../config/firebaseConfig";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [hidePass, setHidePass] = useState(true);
  const [hidePassConfirm, setHidePassConfirm] = useState(true);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  // Navigate
  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.container}>
            <Text style={styles.title}>PokerNoter</Text>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                justifyContent: "space-between",
              }}
            >
              <TextInput
                style={styles.information}
                placeholder="Etunimi"
                onChangeText={(name) => setFirstName(name)}
                value={firstName}
                textContentType="name"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="name"
              />
              <TextInput
                style={styles.information}
                placeholder="Sukunimi"
                onChangeText={(lastName) => setLastName(lastName)}
                value={lastName}
                textContentType="familyName"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="name"
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Syötä sähköpostiosoite"
              onChangeText={(email) => setEmail(email)}
              value={email}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={styles.inputPass}
                placeholder="Syötä salasana"
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

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={styles.inputPass}
                placeholder="Syötä salasana uudelleen"
                onChangeText={(password) => setConfirmPassword(password)}
                value={confirmPassword}
                secureTextEntry={hidePassConfirm}
                textContentType="password"
              />
              <TouchableOpacity
                style={{ padding: 20, marginRight: 20 }}
                onPress={() => setHidePassConfirm(!hidePassConfirm)}
              >
                {hidePassConfirm ? (
                  <MaterialCommunityIcons name="eye-outline" size={24} />
                ) : (
                  <MaterialCommunityIcons name="eye-off-outline" size={24} />
                )}
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                padding: 20,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity style={styles.button} onPress={handleBack}>
                <Text style={styles.buttonText}>Palaa takaisin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  SignUp(firstName, lastName, email, password, confirmPassword)
                }
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

export default RegisterScreen;

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
    marginHorizontal: 20,
    marginVertical: 5,
  },
  information: {
    borderWidth: 2,
    marginVertical: 5,
    padding: 20,
    width: "48%",
  },
  inputPass: {
    flex: 1,
    padding: 20,
    borderWidth: 2,
    marginLeft: 20,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  button: {
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
