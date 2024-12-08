module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin", // Adiciona o plugin do Reanimated
      [
        "@babel/plugin-transform-private-methods",
        { loose: true }, // Configuração para o plugin de métodos privados com modo 'loose'
      ],
      [
        "@babel/plugin-transform-private-property-in-object",
        { loose: true }, // Configuração do plugin de propriedades privadas com modo 'loose'
      ],
      [
        "@babel/plugin-transform-class-properties",
        { loose: true }, // Configuração do plugin de propriedades de classe com modo 'loose'
      ],
    ],
  };
};
