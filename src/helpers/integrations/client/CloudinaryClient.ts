import cloudinary from "@/lib/cloudinary/cloudinary.config";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

/**
 * CloudinaryClient
 * - uploadImage(file: File, folder?: string)
 * - deleteImage(publicId: string)
 *
 * Usa cloudinary.uploader.upload_stream para subir buffers (File => Buffer).
 */
export class CloudinaryClient {
  private readonly defaultFolder: string | undefined;

  constructor() {
    this.defaultFolder = process.env.CLOUDINARY_FOLDER;
  }

  /** Sube una imagen (File) a Cloudinary y devuelve datos importantes */
  async uploadImage(file: File, folder?: string): Promise<{
    url: string;
    publicId: string;
    width?: number;
    height?: number;
    format?: string;
    raw: UploadApiResponse;
  }> {
    if (!file) throw new Error("No se recibió archivo para subir.");

    // Convertir File -> Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadFolder = folder ?? this.defaultFolder;

    return new Promise((resolve, reject) => {
      const options: Record<string, unknown> = {
        quality: "auto",           // Calidad automática
        fetch_format: "auto",      // Usa WebP/AVIF/JPG optimizado
        resource_type: "image",
      };
      
      if (uploadFolder) options.folder = uploadFolder;

      const stream = cloudinary.uploader.upload_stream(
        options,
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new Error(`Error subiendo a Cloudinary: ${error.message || JSON.stringify(error)}`));
            return;
          }
          if (!result) {
            reject(new Error("Respuesta vacía de Cloudinary al subir imagen."));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            raw: result,
          });
        }
      );

      stream.end(buffer);
    });
  }

  
  /**
   * Elimina una imagen por publicId.
   * Devuelve true si la eliminación fue 'ok' o 'not found' (ya no existía).
   */
  async deleteImage(publicId: string): Promise<boolean> {
    if (!publicId) throw new Error("publicId es requerido para eliminar imagen.");

    try {
      const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
      // result puede ser: { result: 'ok' } o { result: 'not found' } o { result: 'error', ... }
      if ((result).result === "ok" || (result).result === "not found") {
        return true;
      }
      // si vino un objeto con error, lo convertimos a string para debug
      throw new Error(`Cloudinary destroy returned: ${JSON.stringify(result)}`);
    } catch (err: unknown) {
      throw new Error(`Error eliminando imagen en Cloudinary`);
    }
  }
}

const cloudinaryClient = new CloudinaryClient();
export default cloudinaryClient;
