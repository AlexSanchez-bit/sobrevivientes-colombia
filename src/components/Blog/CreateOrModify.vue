<template>
  <div class="flex justify-start mb-4">
    <div class="relative">
      <img
        :src="blogImage ?? '/extras/default-blog.jpg'"
        alt="Blog header"
        class="w-48 h-32 border border-gray-300 object-cover rounded-lg"
      />
      <input
        type="file"
        accept="image/*"
        class="absolute inset-0 opacity-0 cursor-pointer"
        @change="onBlogImageChange"
      />
      <i
        class="pi pi-upload pi-2x absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600"
      ></i>
    </div>
  </div>

  <form @submit.prevent="submitForm" class="space-y-4 mb-4">
    <!-- Contenido del Blog -->

    <div>
      <label class="block text-sm font-medium mb-2">Título del artículo</label>
      <InputText
        v-model="form.title"
        :class="{ 'p-invalid': errors.title }"
        class="w-full mb-4"
        placeholder="Ingresa un título llamativo"
      />
      <small v-if="errors.title" class="text-red-500">{{ errors.title }}</small>
    </div>
    <div>
      <label class="block text-sm font-medium mb-2"
        >Contenido del artículo</label
      >
      <Editor
        v-model="form.text"
        :class="{ 'border-red-500': errors.text }"
        class="border rounded-lg overflow-hidden"
        editorStyle="height: 320px"
      />
      <small v-if="errors.text" class="text-red-500">{{ errors.text }}</small>
    </div>

    <!-- Botón de Enviar -->
    <Button
      type="submit"
      :label="mode === 'create' ? 'Publicar artículo' : 'Actualizar artículo'"
      :loading="loading"
      icon="pi pi-send"
      class="w-full bg-[#6f2465] hover:bg-[#5a1d50]"
      :disabled="isSubmitting"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Editor from "primevue/editor";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useToastStorage } from "@/stores/ToasterStorage";
import type { IBlogEntrie } from "@/services/Blog/Blog.service";
import { useBlogEntrieService } from "@/composables/BlogEntrie/useBlogEntrieService";
import { useAuthStore } from "@/stores/AuthStore";
import uploadPublicFile from "@/composables/uploadPublicFile";

const { notify } = useToastStorage();
const router = useRouter();
const service = useBlogEntrieService();
const loading = ref(false);

interface Props {
  mode: "create" | "edit";
  blog_id?: string;
}

const props = defineProps<Props>();
const { mode, blog_id } = props;

// Modelo del formulario
const form = ref<Partial<IBlogEntrie>>({
  text: "",
  image: "",
});

// Estado para la imagen
const blogImage = ref<string | null>(null);
const blogImageFile = ref<File | null>(null);

// Validaciones
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

onMounted(async () => {
  if (mode === "edit" && blog_id) {
    const { data, error } = await service.getDetails(blog_id);
    if (!error && data) {
      form.value = data;
      blogImage.value = data.image;
    } else {
      notify("error", "Error", "No se pudo cargar el artículo", 3000);
    }
  }
});

function validateForm() {
  errors.value = {};

  if (!form.value.title?.trim()) {
    errors.value.title = "El título es obligatorio";
  }

  if (!form.value.text?.trim()) {
    errors.value.text = "El contenido del artículo es obligatorio";
  }

  return Object.keys(errors.value).length === 0;
}

async function submitForm() {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    // Subir imagen si hay archivo nuevo
    if (blogImageFile.value) {
      const imageUrl = await uploadPublicFile(blogImageFile.value);
      if (imageUrl) form.value.image = imageUrl;
    }

    // Lógica de creación/actualización
    if (mode === "create") {
      const error = await service.create({
        user_id: useAuthStore().userData.id,
        ...form.value,
      });
      if (!error) {
        notify("success", "Éxito", "Artículo creado correctamente", 3000);
        router.push({ name: "blog" });
      } else {
        notify("error", "Error", "Ocurrió un error al guardar", 3000);
      }
    } else if (mode === "edit" && blog_id) {
      const error = await service.update(blog_id, form.value);
      if (!error) {
        notify("success", "Éxito", "Artículo actualizado", 3000);
      } else {
        notify("error", "Error", "Ocurrió un error al guardar", 3000);
      }
    }
  } catch (error) {
  } finally {
    isSubmitting.value = false;
  }
}

function onBlogImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    blogImageFile.value = file;
    const reader = new FileReader();
    reader.onload = () => {
      blogImage.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
</script>

<style>
.p-editor-content .ql-container {
  @apply border-none rounded-b-lg;
}

.p-editor-content .ql-toolbar {
  @apply border-gray-200 rounded-t-lg bg-gray-50;
}

.p-editor-content {
  @apply border border-gray-200 rounded-lg;
}
</style>
