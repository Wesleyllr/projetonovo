import { View, Text, Alert, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/firebaseConfig";
import { router } from "expo-router";

const Perfil = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Sucesso", "Você foi deslogado.");
      router.push("/login");
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-primaria">
      <Text>Perfil</Text>
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded"
        onPress={handleLogout}
      >
        <Text className="text-white text-center">Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Perfil;
