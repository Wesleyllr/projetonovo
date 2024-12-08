import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import "@/global.css";

// Impede que a SplashScreen feche automaticamente
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
    // Adicione outras fontes conforme necessário.
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <Stack>
      {/* Aqui você define as rotas principais */}
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      {/* Adicione outras telas principais, se necessário */}
    </Stack>
  );
};

export default RootLayout;
