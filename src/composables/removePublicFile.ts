import { supabase } from "@/setup";

export function extractBucketAndPath(publicUrl) {
  try {
    const url = new URL(publicUrl);
    const pathname = url.pathname;

    // La ruta del pathname generalmente comienza con /storage/v1/object/public/
    // Queremos la parte que sigue a /public/
    const startIndex = pathname.indexOf("/public/") + "/public/".length;
    const bucketAndPath = pathname.substring(startIndex);

    // Dividimos para obtener el nombre del bucket y la ruta del archivo
    const parts = bucketAndPath.split("/");
    const bucketName = parts.shift(); // El primer elemento es el nombre del bucket
    const filePath = parts.join("/"); // El resto es la ruta del archivo

    return { bucketName, filePath };
  } catch (error) {
    console.error("Error al analizar la URL:", error);
    return null;
  }
}

export async function deleteImageByUrl(publicUrl) {
  const { bucketName, filePath } = extractBucketAndPath(publicUrl);

  if (!bucketName || !filePath) {
    console.error(
      "No se pudo extraer el nombre del bucket o la ruta del archivo de la URL.",
    );
    return;
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]); // `remove` espera un array de rutas

    if (error) {
      console.error("Error al eliminar la imagen:", error);
      return false; // Indica que la eliminación falló
    }

    console.log("Imagen eliminada con éxito:", data);
    return true; // Indica que la eliminación fue exitosa
  } catch (error) {
    console.error("Error inesperado al eliminar la imagen:", error);
    return false;
  }
}
