<template>
  <div class="flex justify-start mb-4">
    <div class="relative">
      <p class="text-center absolute top-0 left-2">
        {{ $t("picture") }}
      </p>
      <img :src="profilePicture ?? '/extras/defaultprofile.jpg'" alt=""
        class="w-24 h-24 border border-gray-300 object-cover" />
      <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer"
        @change="onProfilePictureChange" />
      <i class="pi pi-upload pi-2x absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-darkblue"></i>
    </div>
  </div>

  <form @submit.prevent="submitForm" class="space-y-4 mb-4">
    <div>
      <label for="name" class="block text-sm font-medium">{{
        $t("name")
      }}</label>
      <InputText id="name" v-model="form.name" :class="{ 'p-invalid': errors.name }" class="w-full" />
      <small v-if="errors.name" class="text-red-500">{{
        $t(errors.name)
      }}</small>
    </div>

    <div>
      <label for="profile_link" class="block text-sm font-medium">Enlace a su web o redes sociales</label>
      <InputText id="profile_link" v-model="form.link" class="w-full" />
    </div>


    <Button type="submit" :label="mode === 'create'
      ? 'Crear aliado'
      : 'Editar aliado'
      " :loading="loading" icon="pi pi-user-plus" class="w-full" :disabled="isSubmitting" />
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import uploadPublicFile from "@/composables/uploadPublicFile";
import { useRouter } from "vue-router";
import { useToastStorage } from "@/stores/ToasterStorage";
import { type StaffMember } from "@/services/StaffMember/StaffMember.service";
import { useAllieService } from "@/composables/Allie/useAllieService";
import type { IAllies } from "@/services/Allies/Allies.service";

const { notify } = useToastStorage();
const service = useAllieService();
const router = useRouter();
const loading = ref(false);

interface Props {
  mode: "create" | "edit";
  allie_id?: string;
  createdCb?: (id: string) => void;
}

const props = defineProps<Props>();
const { mode, allie_id } = props;

onMounted(async () => {
  if (mode == "edit" && allie_id) {
    const { data, error } = await service.getDetails(allie_id);
    if (!error) {
      form.value = data;
      profilePicture.value = data.picture;
    } else {
      notify(
        "error",
        "Hubo un problema cargando los datos del aliado",
        error.message,
        3000,
      );
    }
  }
});

// Modelo del formulario
const form = ref<Partial<IAllies>>({
  name: "",
});

// Validaciones y errores
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

function validateForm() {
  errors.value = {};

  // Validar nombre
  if (!form.value.name?.trim()) {
    errors.value.name = "El nombre es obligatorio.";
  }

  return Object.keys(errors.value).length === 0;
}

// Foto de perfil
const profilePicture = ref<string | null>(null);
const profilePictureFile = ref<File | null>(null);
function onProfilePictureChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    profilePictureFile.value = file;
    const reader = new FileReader();
    reader.onload = () => {
      profilePicture.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

async function submitForm() {
  if (!validateForm()) return;

  let pictureUrl = profilePicture.value;
  isSubmitting.value = true;
  if (profilePictureFile.value) {
    loading.value = true;
    pictureUrl = await uploadPublicFile(profilePictureFile.value);
    loading.value = false;
    if (!pictureUrl) {
      notify("error", "", "Error al subir la imagen", 3000);
      isSubmitting.value = false;
      return;
    }
  }

  if (mode == "create") {
    loading.value = true;
    const error = await service.create({
      name: form.value.name!,
      icon: pictureUrl,
      link: form.value.link,
    });
    loading.value = false;

    if (!error) {
      notify("success", "", "Aliado creado", 3000);
      router.push({ name: "allies" });
    } else {
      notify("error", "", error.message, 3000);
    }
    isSubmitting.value = false;
  }

  if (mode == "edit" && allie_id) {
    loading.value = true;
    const error = await service.update(allie_id, {
      name: form.value.name!,
      icon: pictureUrl,
      link: form.value.link,
    });
    loading.value = false;

    if (!error) {
      notify("success", "", "Aliado editado", 3000);
      router.push({ name: "allies" });
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
