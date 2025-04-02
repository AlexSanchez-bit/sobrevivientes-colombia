<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-extrabold text-gray-800 mb-6">Datos del Bot</h1>

    <!-- Sección de carga de archivos -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          @click="$refs.fileUploader.click()"
          icon="pi pi-plus"
          class="!border-darkblue w-40 h-40 !text-darkblue bg-transparent border-2 transition duration-200 hover:bg-darkblue hover:!text-white"
          v-permission="[Permission.WRITE_BOT_TRAIN]"
        />
        <div class="text-gray-600 text-sm">
          <p>
            Haz clic en el botón o arrastra y suelta tus documentos (PDF o DOCX)
            para entrenar al bot.
          </p>
        </div>
      </div>
      <input
        ref="fileUploader"
        type="file"
        multiple
        @change="handleFileUpload"
        class="hidden"
        accept=".pdf, .docx"
      />
    </div>

    <!-- Lista de archivos -->
    <div>
      <!-- Vista en desktop: Tabla -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
              >
                Archivo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
              >
                Vista Previa
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="(file, index) in files"
              :key="file.name"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Nombre y estado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-800">{{
                    file.name
                  }}</span>
                  <span
                    v-if="file.isUploading"
                    class="text-xs text-gray-500 flex items-center gap-2 mt-1"
                  >
                    <ProgressSpinner class="w-4 h-4" strokeWidth="4" />
                    Cargando...
                  </span>
                </div>
              </td>
              <!-- Vista previa -->
              <td
                class="px-6 py-4 whitespace-pre-line text-sm text-gray-600 line-clamp-2"
              >
                {{ file.preview }}
              </td>
              <!-- Acciones -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex justify-center gap-2">
                  <button
                    v-if="!file.trained"
                    @click="trainFile(file)"
                    :disabled="file.isTraining"
                    class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
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
                    class="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
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

      <!-- Vista en mobile: Tarjetas -->
      <div class="grid grid-cols-1 gap-4 md:hidden">
        <div
          v-for="(file, index) in files"
          :key="file.name"
          class="bg-white shadow rounded-lg p-4 border border-gray-200"
        >
          <div class="mb-2">
            <h2 class="text-lg font-semibold text-gray-800">{{ file.name }}</h2>
            <div
              v-if="file.isUploading"
              class="flex items-center gap-2 text-xs text-gray-500 mt-1"
            >
              <ProgressSpinner class="w-4 h-4" strokeWidth="4" />
              <span>Cargando...</span>
            </div>
          </div>
          <p class="text-sm text-gray-600 line-clamp-3 mb-4">
            {{ file.preview }}
          </p>
          <div class="flex justify-end gap-2">
            <button
              v-if="!file.trained"
              @click="trainFile(file)"
              :disabled="file.isTraining"
              class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
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
              class="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
              v-permission="[Permission.WRITE_BOT_TRAIN]"
            >
              <span v-if="file.isDeleting">
                <ProgressSpinner class="w-4 h-4" strokeWidth="4" />
              </span>
              <span v-else>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
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
import { useToastStorage } from "@/stores/ToasterStorage";

const service = useTrainService();

interface UploadedFile {
  name: string;
  preview: string;
  trained: boolean;
  isUploading: boolean;
  isTraining: boolean;
  isDeleting: boolean;
  file?: File;
}

const { notify } = useToastStorage();
const files = ref<UploadedFile[]>([]);

onMounted(async () => {
  const resp = await service.getAll([], new Pagination(0, 100), []);
  if (resp) {
    files.value = resp.map((elem: any) => ({
      name: elem.document_name,
      preview: elem.example_content,
      trained: true,
      isUploading: false,
      isTraining: false,
      isDeleting: false,
    }));
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
      isUploading: false,
      isTraining: false,
      isDeleting: false,
      file: file,
    });

    // Si el archivo permite obtener preview
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
      };
      reader.readAsText(file);
    } else {
      files.value.push(newFile);
    }
  });
  (event.target as HTMLInputElement).value = "";
}

async function deleteFile(file: UploadedFile, index: number) {
  file.isDeleting = true;
  try {
    const fileDeletion = await removeBotFile(file.name);
    file.isDeleting = false;
    if (fileDeletion.error) {
      throw new Error(fileDeletion.error.message);
    }
    const { error } = await service.delete(file.name);
    if (error) {
      throw new Error(error.message);
    }
    files.value.splice(index, 1);
  } catch (error: any) {
    notify("error", "Ha ocurrido un error", error.message, 3000);
  }
}

async function trainFile(file: UploadedFile) {
  file.isTraining = true;
  try {
    file.isUploading = true;
    const { error: uploadError } = await uploadBotFile(file.file);
    file.isUploading = false;
    if (uploadError) {
      notify(
        "error",
        "Error al subir el archivo",
        "Archivo duplicado o ilegible",
        3000,
      );
      return;
    }
    const { data: trainData, error } = await service.train(file.name);
    file.trained = true;
    console.log(trainData, error);
  } catch (error) {
    console.error(error);
  } finally {
    file.isTraining = false;
  }
}
</script>

<style scoped>
/* Estilos adicionales para mejorar la presentación */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
