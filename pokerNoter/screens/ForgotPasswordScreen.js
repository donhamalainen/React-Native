import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
// Firebase & Config
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState(null);
  // Navigointi
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };

  // Nollaus
  const handleReset = async () => {
    try {
      if (!email) {
        throw new Error("Ole hyvä ja syötä sähköpostiosoite");
      }
      await sendPasswordResetEmail(auth, email);
      alert("Salasanan palautuspyyntö lähetetty sähköpostiin.");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      alert(
        "Virhe salasanan palauttamisessa. Tarkista antamasi sähköpostiosoite."
      );
    }
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
            <TextInput
              style={styles.input}
              placeholder="Syötä sähköpostiosoite"
              onChangeText={(email) => setEmail(email)}
              value={email}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoCorrect={false}
            />

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
              <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Text style={styles.buttonText}>Lähetä nollaus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

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
  buttonText: {
    fontSize: 16,
  },
  button: {
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
