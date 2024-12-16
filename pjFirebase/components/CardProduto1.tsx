import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";

const CardProduto1 = ({ imageSource, price, title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="w-32 h-48 bg-white">
        <Image
          className="w-32 h-32 rounded-2xl"
          source={imageSource}
          resizeMode="contain"
        />
        <Text className="font-extrabold text-lg text-green-600">{price}</Text>
        <Text className="flex-1 text-base leading-[14px]" numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CardProduto1;
