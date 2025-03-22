<template>
  <!-- Imagen grande ocupando el ancho completo -->
  <div class="mb-4">
    <div class="relative">
      <img
        :src="profileImage ?? '/extras/defaultprofile.jpg'"
        alt="Imagen de la Promoción"
        class="w-full h-96 border border-gray-300 object-cover"
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
    <!-- Rango de fechas -->
    <div>
      <label for="dateRange" class="block text-sm font-medium">
        Fechas de Duración
      </label>
      <Calendar
        id="dateRange"
        v-model="dateRange"
        selectionMode="range"
        :showIcon="true"
        class="w-full"
      />
      <small v-if="errors.date" class="text-red-500">{{ errors.date }}</small>
    </div>

    <!-- Texto -->
    <div>
      <label for="text" class="block text-sm font-medium">{{
        $t("Texto de la Promoción")
      }}</label>
      <TinyMce
        id="text"
        :value="form.text"
        menubar="format"
        @input="form.text = $event"
      />
      <small v-if="errors.text" class="text-red-500">{{ errors.text }}</small>
    </div>

    <!-- Redirection URL -->
    <div>
      <label for="redirection_url" class="block text-sm font-medium">
        {{ $t("URL de redirección (opcional)") }}
      </label>
      <InputText
        id="redirection_url"
        v-model="form.redirection_url"
        class="w-full"
      />
    </div>

    <!-- Redirection Text -->
    <div>
      <label for="redirection_text" class="block text-sm font-medium">
        {{ $t("texto de redirección (opcional)") }}
      </label>
      <InputText
        id="redirection_text"
        v-model="form.redirection_text"
        class="w-full"
      />
    </div>

    <!-- Botón de Enviar -->
    <Button
      type="submit"
      :label="mode === 'create' ? 'Crear Promoción' : 'Editar Promoción'"
      :loading="loading"
      icon="pi pi-check"
      class="w-full"
      :disabled="isSubmitting"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import TinyMce from "@/components/Tinymce/index.vue";
import uploadPublicFile from "@/composables/uploadPublicFile";
import { useRouter } from "vue-router";
import { useToastStorage } from "@/stores/ToasterStorage";
import { usePromotionService } from "@/composables/Promotion/usePromotionService";
import type { IPromotion } from "@/services/Promotion/Promotion.service";

const { notify } = useToastStorage();
const service = usePromotionService();
const router = useRouter();
const loading = ref(false);

interface Props {
  mode: "create" | "edit";
  promotion_id?: string;
  createdCb?: (id: string) => void;
}

const props = defineProps<Props>();
const { mode, promotion_id } = props;

// Estado reactivo del formulario
const form = ref<Partial<IPromotion>>({
  start_date: new Date(),
  end_date: new Date(),
  text: "",
});

// Variable reactiva para el rango de fechas (Calendar en modo range)
const dateRange = ref<[Date, Date]>([new Date(), new Date()]);

// Si se está editando, cargar los datos existentes
onMounted(async () => {
  if (mode === "edit" && promotion_id) {
    const { data, error } = await service.getDetails(promotion_id);
    if (!error) {
      form.value = data;
      profileImage.value = data.image;
      dateRange.value = [new Date(data.start_date), new Date(data.end_date)];
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

// Actualizar el formulario cuando cambie el rango de fechas
watch(dateRange, (newVal) => {
  if (newVal && newVal.length === 2) {
    form.value.start_date = newVal[0];
    form.value.end_date = newVal[1];
  }
});

// Validaciones y errores
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

function validateForm() {
  errors.value = {};
  if (!form.value.text) {
    errors.value.text = "El texto es obligatorio";
  }
  if (!form.value.start_date || !form.value.end_date) {
    errors.value.date = "Las fechas son obligatorias";
  }
  return Object.keys(errors.value).length === 0;
}

// Gestión de la imagen de promoción
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

  if (mode === "create") {
    loading.value = true;
    const error = await service.create({
      start_date: form.value.start_date,
      end_date: form.value.end_date,
      text: form.value.text,
      redirection_url: form.value.redirection_url,
      image: imageUrl,
      redirection_text: form.value.redirection_text,
    });
    loading.value = false;

    if (!error) {
      notify("success", "", "Creado", 3000);
      router.push({ name: "promotions" });
    } else {
      notify("error", "", error.message, 3000);
    }
    isSubmitting.value = false;
  }

  if (mode === "edit" && promotion_id) {
    loading.value = true;
    const error = await service.update(promotion_id, {
      start_date: form.value.start_date,
      end_date: form.value.end_date,
      text: form.value.text,
      redirection_url: form.value.redirection_url,
      image: imageUrl,
      redirection_text: form.value.redirection_text,
    });
    loading.value = false;

    if (!error) {
      notify("success", "", "Editado", 3000);
      router.push({ name: "promotions" });
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
