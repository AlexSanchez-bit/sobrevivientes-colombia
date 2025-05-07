import { supabase } from "@/setup";

export default async function uploadPublicFile(file: File) {
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "pdf",];
  const fileExtension = file.name.split(".").pop().toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    console.error("Error: Extensión no permitida.");
    return;
  }

  // Ruta del archivo en el bucket (debe incluir la carpeta "public")
  const bucketName = "images";
  const folderName = "public"; // La carpeta donde se debe guardar
  const filePath = `${folderName}/${Date.now()}${file.name.toLowerCase().trim().replace(/ /g, "")}`;

  // Subir el archivo al bucket
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (error) {
    console.error("Error al subir el archivo:", error.message);
    return null;
  }

  console.log("Archivo subido correctamente:", data);

  // Generar la URL pública del archivo (si es necesario)
  const { data: fdata } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  console.log("URL pública:", fdata.publicUrl);

  return fdata.publicUrl;
}
