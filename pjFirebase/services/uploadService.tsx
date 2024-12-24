import { uploadImage } from "@/scripts/uploadImage";

export const uploadProductImage = async (imageUri) => {
  if (!imageUri) return "";
  return await uploadImage(imageUri);
};
