import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Certifique-se de configurar corretamente o firebase
import { useRouter } from "expo-router"; // Importando useRouter
import FormField from "@/components/FormField";
import { Platform } from "react-native";
import CustomAlert from "@/components/CustomAlert";
import CustomButton from "@/components/CustomButton";
import CustomAlert2 from "@/components/CustomAlert2";
import { Button } from "react-native-elements";
import { images } from "@/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const getFriendlyErrorMessage = (errorCode) => {
    const errorMessages = {
      "auth/invalid-email": "Por favor, insira um email válido.",
      "auth/user-not-found": "Usuário não encontrado. Verifique o email ou cadastre-se.",
      "auth/wrong-password": "Senha incorreta. Tente novamente.",
      "auth/email-already-in-use": "Este email já está em uso. Tente outro ou faça login.",
      "auth/weak-password": "A senha é muito fraca. Escolha uma senha mais segura.",
      "auth/too-many-requests":
        "Muitas tentativas falhas. Por favor, tente novamente mais tarde.",
      "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
      "auth/requires-recent-login":
        "Faça login novamente para concluir esta ação.",
      "auth/operation-not-allowed":
        "Este tipo de autenticação está temporariamente desativado.",
      "auth/invalid-credential":
        "Senha inválida.",
      "auth/missing-password":
        "Insira a senha.",
    };
  
    return errorMessages[errorCode] || error.message;
  };
  
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login bem-sucedido, navegue para a Home
        router.push("/home");
      })
      .catch((error) => {
        const friendlyMessage = getFriendlyErrorMessage(error.code);
        Alert.alert("Erro", friendlyMessage);
      });
  };

  const handleAnotherAction = () => {
    // Navegar para outra tela usando push
    router.push("/cadastrarUsuario"); // Substitua "OutraTela" pela tela desejada
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-white">
      <Text className="text-4xl font-bold text-center mb-5">Bem vindo(a)!</Text>
      <Image />
      <FormField
        title="Email"
        value={email}
        handleChangeText={(e) => setEmail(e)}
        keyboardType="email-address"
        otherStyles={`mt-7 w-full ${
          Platform.OS === "web" ? "max-w-[400px]" : ""
        }`}
      />
      <FormField
        title="Senha"
        value={password}
        handleChangeText={(e) => setPassword(e)}
        otherStyles={`mt-7 w-full ${
          Platform.OS === "web" ? "max-w-[400px]" : ""
        }`}
      />
      <View
        className={`flex-row justify-between w-full items-end ${
          Platform.OS === "web" ? "max-w-[400px]" : ""
        }`}
      >
        <TouchableOpacity onPress={handleAnotherAction}>
          <Text className="ml-4 text-secundaria-800 font-pregular text-sm">
            Cadastrar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            Platform.OS === "web" ? "max-w-[400px]" : ""
          }`}
          onPress={handleAnotherAction}
        >
          <Text className="text-secundaria-800 font-pregular text-sm mr-4">
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>
      </View>
      <View
        className={` w-full justify-start items-end ${
          Platform.OS === "web" ? "max-w-[300px]" : ""
        }`}
      >
        <CustomButton
          title="Login"
          handlePress={handleLogin}
          containerStyles={`mt-6 w-full ${
            Platform.OS === "web" ? "max-w-[300px]" : ""
          }`}
        />
      </View>
      <TouchableOpacity className="mt-4 w-14 h-14 items-center justify-center border border-secundaria rounded-full">
      <Image source={images.google1} className="w-9 h-9" resizeMode="contain"/>

      </TouchableOpacity>
    </View>
  );
};

export default Login;
