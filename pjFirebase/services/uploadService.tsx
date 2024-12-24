import { uploadImage } from "@/scripts/uploadImage";

export class UploadService {
  static async uploadProductImage(imageUri: string): Promise<string> {
    if (!imageUri) return "";
    return await uploadImage(imageUri);
  }
}
