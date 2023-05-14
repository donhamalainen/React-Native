import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
// CONTEXT
import { AuthContext } from "../context/AuthContext";

const ProfileScreen = () => {
  const { data, Logout } = useContext(AuthContext);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, paddingHorizontal: 25 }}>
        {/* Profiili nimi */}
        <View>
          <Text style={{ fontSize: 18 }}>Tervehdys</Text>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>
            {data.nimi}🔥
          </Text>
        </View>

        {/* KIRJAUDU ULOS */}
        <View style={{ position: "absolute", bottom: 40, right: 25 }}>
          <TouchableOpacity
            onPress={() => Logout()}
            style={{
              backgroundColor: "coral",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 14 }}>Kirjaudu ulos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
