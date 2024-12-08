import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View>
      <Text>Bem-vindo à Home!</Text>
      <Button
        title="Ir para Cadastro"
        onPress={() => router.push("/screens/SignUpScreen")}
      />
    </View>
  );
};

export default HomeScreen;
