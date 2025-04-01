import { supabase } from "@/setup";

export async function uploadBotFile(file: File) {
  // Validar si el archivo tiene una extensión permitida
  const allowedExtensions = ["pdf", "docx"];
  const fileExtension = file.name.split(".").pop().toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    console.error("Error: Extensión no permitida.");
    return;
  }

  // Ruta del archivo en el bucket (debe incluir la carpeta "public")
  const bucketName = "private";
  const folderName = "bot_files"; // La carpeta donde se debe guardar
  const filePath = `${folderName}/${file.name}`;

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

export async function removeBotFile(docname: string) {
  const bucketName = "private";
  const folderName = "bot_files";
  const filePath = `${folderName}/${docname}`;
  return await supabase.storage.from(bucketName).remove([filePath]);
}
