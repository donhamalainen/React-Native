import React from "react";
import { StatusBar } from "expo-status-bar";
// ROOT NAV
import RootNavigation from "./navigation/RootNavigation";
// Provider
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      {/* STATUSBAR */}
      <StatusBar style="auto" />
      {/* ROOT NAV */}
      <RootNavigation />
    </AuthProvider>
  );
}
