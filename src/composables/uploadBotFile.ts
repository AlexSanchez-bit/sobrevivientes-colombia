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
  return await supabase.storage.from(bucketName).upload(filePath, file);
}

export async function removeBotFile(docname: string) {
  const bucketName = "private";
  const folderName = "bot_files";
  const filePath = `${folderName}/${docname}`;
  return await supabase.storage.from(bucketName).remove([filePath]);
}
