<template>
  <div class="flex justify-start mb-4">
    <div class="relative">
      <p class="text-center absolute top-0 left-2">
        {{ $t("icon") }}
      </p>
      <img
        :src="profileImage ?? '/extras/defaultprofile.jpg'"
        alt=""
        class="w-24 h-24 border border-gray-300 object-cover"
      />
      <input
        type="file"
        accept="image/*"
        class="absolute inset-0 opacity-0 cursor-pointer"
        @change="onProfileImageChange"
      />
      <i
        class="pi pi-upload pi-2x absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-darkblue"
      ></i>
    </div>
  </div>

  <form @submit.prevent="submitForm" class="space-y-4 mb-4">
    <!-- Nombre -->
    <div>
      <label for="name" class="block text-sm font-medium">{{
        $t("name")
      }}</label>
      <InputText
        id="name"
        v-model="form.name"
        :class="{ 'p-invalid': errors.name }"
        class="w-full"
      />
      <small v-if="errors.name" class="text-red-500">{{
        $t(errors.name)
      }}</small>
    </div>

    <!-- Apellidos -->
    <div>
      <label for="description" class="block text-sm font-medium">{{
        $t("description")
      }}</label>
      <TinyMce
        id="description"
        :value="form.description"
        menubar="format"
        @input="form.description = $event"
      />
    </div>

    <!-- Número Telefónico -->

    <!-- Botón de Enviar -->
    <Button
      type="submit"
      :label="
        mode === 'create' ? 'Crear tipo de laico' : 'Editar tipo de Laico'
      "
      :loading="loading"
      icon="pi pi-user-plus"
      class="w-full"
      :disabled="isSubmitting"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import TinyMce from "@/components/Tinymce/index.vue";
import uploadPublicFile from "@/composables/uploadPublicFile";
import { useRouter } from "vue-router";
const service = useLaicsService();
import { useToastStorage } from "@/stores/ToasterStorage";
import { useLaicsService } from "@/composables/LaicType/useLaicService";
import type { ILaic } from "@/services/Laics/Laic.service";
const { notify } = useToastStorage();

const router = useRouter();
const loading = ref(false);

interface Props {
  mode: "create" | "edit";
  laic_id?: string;
  createdCb?: (id: string) => void;
}

const props = defineProps<Props>();
const { mode, laic_id } = props;

onMounted(async () => {
  if (mode == "edit") {
    const { data, error } = await service.getDetails(laic_id!);
    if (!error) {
      form.value = data;
      profileImage.value = data.icon;
    } else {
      notify(
        "error",
        "Hubo un problema cargando los datos",
        error.message,
        3000,
      );
    }
  }
});

// Modelo del formulario

// Estado reactivo para el formulario
const form = ref<Partial<ILaic>>({
  name: "",
  image: "",
});

// Validaciones y errores
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

function validateForm() {
  errors.value = {};

  // Validar nombre
  if (!form.value.name.trim()) {
    errors.value.name = "El nombre es obligatorio.";
  }

  return Object.keys(errors.value).length === 0;
}

// Foto de perfil
const profileImage = ref<string | null>(null);
const profileImageFile = ref<File | null>(null);
function onProfileImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    profileImageFile.value = file;
    const reader = new FileReader();
    reader.onload = () => {
      profileImage.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

async function submitForm() {
  if (!validateForm()) return;

  let imageUrl = profileImage.value;
  isSubmitting.value = true;
  if (profileImageFile.value) {
    loading.value = true;
    imageUrl = await uploadPublicFile(profileImageFile.value);
    loading.value = false;
    if (!imageUrl) {
      notify("error", "", "Error al subir la imagen", 3000);
      isSubmitting.value = false;
      return;
    }
  }

  if (mode == "create") {
    loading.value = true;
    const error = await service.create({
      name: form.value.name,
      image: imageUrl,
      description: form.value.description,
    });
    loading.value = false;

    if (!error) {
      notify("success", "", "Creado", 3000);

      router.push({ name: "laics" });
    } else {
      notify("error", "", error.message, 3000);
    }
    isSubmitting.value = false;
  }

  if (mode == "edit") {
    loading.value = true;
    const error = await service.update(laic_id, {
      name: form.value.name,
      image: imageUrl,
      description: form.value.description,
    });
    loading.value = false;

    if (!error) {
      notify("success", "", "Editado", 3000);
      router.push({ name: "laics" });
    } else {
      notify("error", "", error.message, 3000);
    }
    isSubmitting.value = false;
  }
}
</script>

<style>
/* Estilo adicional para inputs inválidos */
.p-invalid {
  border-color: #f87171 !important;
  box-shadow: 0 0 0 1px #f87171 !important;
}
</style>
