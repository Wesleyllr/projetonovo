import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";

type FormFieldProductProps = {
  title: string; // Título do campo
  value: string; // Valor do campo
  handleChangeText: (text: string) => void; // Função para manipular a entrada
  otherStyles?: string; // Estilos adicionais (opcional)
  placeholder?: string;
  keyboardType?: string; // Tipo de teclado (opcional)
};

const FormFieldProduct: React.FC<FormFieldProductProps> = ({
  title,
  value = "", // Garantir que o valor seja sempre uma string
  handleChangeText,
  otherStyles = "",
  placeholder = "",
  keyboardType = "default",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Condição para mostrar o título: se estiver em foco ou se houver valor no campo
  const shouldShowTitle = isFocused || value.length > 0;

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View className="w-full h-16 px-4 bg-secundaria flex-col justify-end">
        {/* Exibe o título se o campo estiver em foco ou tiver valor digitado */}
        {shouldShowTitle && (
          <Text className="text-base text-secundaria-600 font-psemibold">
            {title}
          </Text>
        )}
        <TextInput
          className="w-full text-secundaria-950 font-psemibold text-base bg-gray-500 justify-end"
          value={value} // Mantém o valor atualizado
          placeholder={placeholder}
          placeholderTextColor="#0090ce"
          onFocus={() => setIsFocused(true)} // Quando clicar, mostrar o título
          onBlur={() => setIsFocused(false)} // Quando sair, manter o título se houver texto
          onChangeText={handleChangeText} // Atualiza o valor
          keyboardType={keyboardType}
        />
      </View>
      <View className="w-full h-[2px] bg-secundaria-700" />
    </View>
  );
};

export default FormFieldProduct;
