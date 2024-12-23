import React from "react";
import { View, TouchableOpacity } from "react-native";

const ColorSelector = ({
  selectedColor,
  setSelectedColor,
  disabled,
  onColorSelect, // Nova prop para callback
}) => {
  const colors = [
    "#f9fafb",
    "#2dde12",
    "#603209",
    "#007bff",
    "#ff0000",
    "#ffc107",
    "#fd7e14",
    "#6f42c1",
  ];

  const handleColorSelect = (color) => {
    if (!disabled) {
      setSelectedColor(color);
      onColorSelect?.(color); // Chama o callback se existir
    }
  };

  return (
    <View className="flex-1 flex-row justify-between flex-wrap gap-2">
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          className="min-h-12 min-w-12 max-h-14 max-w-14 rounded-md"
          style={{
            backgroundColor: color,
            borderWidth: selectedColor === color ? 2 : 0,
            borderColor: selectedColor === color ? "#ffffff" : "transparent",
            opacity: disabled ? 0.5 : 1,
          }}
          onPress={() => handleColorSelect(color)}
          disabled={disabled}
        />
      ))}
    </View>
  );
};

export default ColorSelector;
