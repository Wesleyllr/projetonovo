import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { icons } from "@/constants";

type HeaderProps = {
  onGoBack: () => void; // Ação de voltar, passada como prop
  onSave: () => void; // Ação de salvar, passada como prop
};

const Header: React.FC<HeaderProps> = ({ onGoBack, onSave }) => {
  return (
    <View className="flex-row items-center justify-between p-1 bg-secundaria">
      <Text className="text-white text-xl font-bold absolute w-full text-center">
        Criar Produto
      </Text>
      {/* Botão Voltar */}
      <TouchableOpacity onPress={onGoBack}>
        <Image
          source={icons.leftArrow}
          resizeMode="contain"
          className="w-8 h-8 ml-2"
          tintColor="#085072"
        />
      </TouchableOpacity>

      {/* Título */}

      {/* Botão Salvar */}
      <TouchableOpacity onPress={onSave} className="p-1 mr-1 flex-row">
        <Text className="text-lg font-bold align-middle text-secundaria-900">
          Salvar
        </Text>

        <Image
          source={icons.save}
          resizeMode="contain"
          className="w-10 h-10"
          tintColor="#085072"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
