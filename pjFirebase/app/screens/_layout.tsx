import { Stack } from "expo-router";

// Configuração do layout para a pasta SCREENS
export default function ScreensLayout() {
  return (
    <Stack>
      {/* Defina a tela de cadastro */}
      <Stack.Screen
        name="SignUpScreen"
        options={{
          title: "Cadastro",
          headerShown: false, // Mostra o cabeçalho para a tela de cadastro
        }}
      />
      {/* Defina a tela de login */}
      <Stack.Screen
        name="HomeScreen"
        options={{
          title: "Home",
          headerShown: false, // Mostra o cabeçalho para a tela home
        }}
      />
    </Stack>
  );
}