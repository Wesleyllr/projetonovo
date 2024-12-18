import { cssInterop } from "nativewind";
import { Image } from "expo-image";

// Aplica o cssInterop ao componente Image para aceitar o uso de className
cssInterop(Image, { className: "style" });
