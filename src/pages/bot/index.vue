<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Mural de Archivos</h1>

    <!-- Botón para subir archivos -->
    <div class="mb-4 flex items-center gap-4">
      <Button
        @click="$refs.fileUploader.click()"
        icon="pi pi-plus"
        class="!border-darkblue w-40 h-40 !text-darkblue bg-transparent border-2"
        v-permission="[Permission.WRITE_BOT_TRAIN]"
      />
      <input
        ref="fileUploader"
        type="file"
        multiple
        @change="handleFileUpload"
        class="hidden"
        accept=".pdf, .docx"
      />
    </div>

    <!-- Tabla de archivos -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Archivo
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Vista Previa
            </th>
            <th
              class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(file, index) in files" :key="file.name">
            <!-- Nombre y estado de carga de subida -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-900">{{
                  file.name
                }}</span>
                <span
                  v-if="file.isUploading"
                  class="text-xs text-gray-500 flex items-center gap-2"
                >
                  <ProgressSpinner class="w-4 h-4" strokeWidth="4" />
                  Cargando...
                </span>
              </div>
            </td>

            <!-- Vista previa del contenido -->
            <td
              class="px-6 py-4 whitespace-pre-line text-sm text-gray-500 line-clamp-2"
            >
              {{ file.preview }}
            </td>

            <!-- Botones de acción con loaders individuales -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <div class="flex justify-center gap-2">
                <button
                  v-if="!file.trained"
                  @click="trainFile(file)"
                  :disabled="file.isTraining"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"
                  v-permission="[Permission.WRITE_BOT_TRAIN]"
                >
                  <span v-if="file.isTraining">
                    <ProgressSpinner class="w-4 h-4" strokeWidth="4" />
                  </span>
                  <span v-else>Entrenar</span>
                </button>
                <button
                  @click="deleteFile(file, index)"
                  :disabled="file.isDeleting"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2"
                  v-permission="[Permission.WRITE_BOT_TRAIN]"
                >
                  <span v-if="file.isDeleting">
                    <ProgressSpinner class="w-4 h-4" strokeWidth="4" />
                  </span>
                  <span v-else>Eliminar</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import { uploadBotFile, removeBotFile } from "@/composables/uploadBotFile";
import { Permission } from "@/utils/Permissions";
import { useTrainService } from "@/composables/TrainData/useTrainService";
import { Pagination } from "@/utils/entities/Pagination";

const service = useTrainService();

interface UploadedFile {
  name: string;
  preview: string;
  trained: boolean;
  isUploading: boolean;
  isTraining: boolean;
  isDeleting: boolean;
}

const files = ref<UploadedFile[]>([]);

// Cargar archivos existentes en el montaje
onMounted(async () => {
  const resp = await service.getAll([], new Pagination(0, 100), []);
  if (resp) {
    files.value = resp.map((elem: any) => {
      return {
        name: elem.document_name,
        preview: elem.example_content,
        trained: true,
        isUploading: false,
        isTraining: false,
        isDeleting: false,
      };
    });
  }
});

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;
  const uploadedFiles = Array.from(target.files);

  uploadedFiles.forEach((file) => {
    const newFile = reactive({
      name: file.name,
      preview: "No hay preview",
      trained: false,
      isUploading: true,
      isTraining: false,
      isDeleting: false,
    });

    // Si el archivo es de un tipo que permite obtener preview
    if (
      !file.name.toLowerCase().endsWith(".docx") &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;
        const lines = content.split("\n");
        newFile.preview = lines.slice(0, 2).join("\n");
        files.value.push(newFile);
        // Subir archivo
        const resp = await uploadBotFile(file);
        newFile.isUploading = false;
        console.log(resp);
      };
      reader.readAsText(file);
    } else {
      // Si no se puede obtener preview, se agrega directamente
      files.value.push(newFile);
      (async () => {
        const resp = await uploadBotFile(file);
        newFile.isUploading = false;
        console.log(resp);
      })();
    }
  });

  // Reiniciar el input para permitir volver a subir el mismo archivo si es necesario
  (event.target as HTMLInputElement).value = "";
}

async function deleteFile(file: UploadedFile, index: number) {
  file.isDeleting = true;
  try {
    const fileDeletion = await removeBotFile(file.name);
    console.log("Eliminación del archivo: ", fileDeletion);
    const resp = await service.delete(file.name);
    console.log("Eliminación en servicio: ", resp);
    files.value.splice(index, 1);
  } catch (error) {
    console.error(error);
  }
}

async function trainFile(file: UploadedFile) {
  file.isTraining = true;
  try {
    const { data, error } = await service.train(file.name);
    file.trained = true;
    console.log(data, error);
  } catch (error) {
    console.error(error);
  } finally {
    file.isTraining = false;
  }
}
</script>

<style scoped>
/* Puedes agregar estilos adicionales o personalizaciones si es necesario */
</style>
