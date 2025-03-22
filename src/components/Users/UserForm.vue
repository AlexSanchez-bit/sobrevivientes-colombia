<template>
  <!-- Foto de Perfil -->
  <div class="flex justify-start mb-4">
    <div class="relative">
      <img
        :src="profileImage ?? '/extras/defaultprofile.jpg'"
        alt=""
        class="w-24 h-24 rounded-full border border-gray-300 object-cover"
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

  <form @submit.prevent="submitForm" class="space-y-4">
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

    <!-- Correo Electrónico -->
    <div>
      <label for="email" class="block text-sm font-medium">{{
        $t("email")
      }}</label>
      <InputText
        id="email"
        v-model="form.email"
        :class="{ 'p-invalid': errors.email }"
        class="w-full"
      />
      <small v-if="errors.email" class="text-red-500">{{
        $t(errors.email)
      }}</small>
    </div>

    <!-- Contraseña -->
    <div class="w-full" v-if="mode == 'create'">
      <label for="password" class="block text-sm font-medium">{{
        $t("password")
      }}</label>
      <Password
        id="password"
        v-model="form.password"
        :class="{ 'p-invalid': errors.password }"
        class="w-full"
        feedback
      />
      <small v-if="errors.password" class="text-red-500">{{
        $t(errors.password)
      }}</small>
    </div>

    <!-- Botón de Enviar -->
    <Button
      type="submit"
      :label="
        mode === 'create'
          ? $t('create') + ' ' + $t('user')
          : $t('edit') + ' ' + $t('user')
      "
      icon="pi pi-user-plus"
      class="w-full"
      :disabled="isSubmitting"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";

import { useUserService } from "@/composables/Users/useUserService";
import uploadPublicFile from "@/composables/uploadPublicFile";
import { useRouter } from "vue-router";
const { userService: service } = useUserService();
import { useToastStorage } from "@/stores/ToasterStorage";
import { useI18n } from "vue-i18n";
const { notify } = useToastStorage();

const router = useRouter();

interface Props {
  mode: "create" | "edit";
  user_id?: string;
  createdCb?: (id: string) => void;
}

const props = defineProps<Props>();
const { mode, user_id } = props;

onMounted(async () => {
  if (mode == "edit") {
    const { data, error } = await service.getUserData(user_id!);
    if (!error) {
      form.value = data;
      profileImage.value = data.profile_picture;
    } else {
      notify(
        "error",
        "Hubo un problema buscando al usuario",
        error.message,
        3000,
      );
    }
  }
});

// Modelo del formulario
interface UserForm {
  name: string;
  email: string;
  password: string;
}

// Estado reactivo para el formulario
const form = ref<UserForm>({
  name: "",
  email: "",
  password: "",
});

// Validaciones y errores
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

// Foto de perfil
const profileImage = ref<string | null>(null);
const profileImageFile = ref<File | null>(null);

function validateForm() {
  errors.value = {};

  // Validar nombre
  if (!form.value.name.trim()) {
    errors.value.name = "El nombre es obligatorio.";
  }

  // Validar correo electrónico
  if (!form.value.email.trim()) {
    errors.value.email = "El correo electrónico es obligatorio.";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.value.email)) {
    errors.value.email = "El correo electrónico no es válido.";
  }

  // Validar contraseña
  if (mode == "create") {
    if (!form.value.password.trim()) {
      errors.value.password = "La contraseña es obligatoria.";
    } else if (form.value.password.length < 6) {
      errors.value.password = "La contraseña debe tener al menos 6 caracteres.";
    }
  }

  return Object.keys(errors.value).length === 0;
}

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

const { t } = useI18n();

async function submitForm() {
  if (!validateForm()) return;

  let imageUrl = profileImage.value;
  isSubmitting.value = true;
  if (profileImageFile.value) {
    imageUrl = await uploadPublicFile(profileImageFile.value);
    if (!imageUrl) {
      notify("error", "", "Error al subir la imagen", 3000);
      isSubmitting.value = false;
      return;
    }
  }

  if (mode == "create") {
    const { error, user } = await service.createUser(
      form.value.name,
      form.value.email,
      form.value.password,
      imageUrl,
    );

    if (!error) {
      notify("success", "", t("user_created"), 3000);
      props.createdCb?.(user.id);

      router.push({ name: "users" });
    } else {
      notify("error", "", error, 3000);
    }
    isSubmitting.value = false;
  }

  if (mode == "edit") {
    const error = await service.updateUser(
      user_id,
      form.value.name,
      form.value.email,
      imageUrl,
    );

    if (!error) {
      notify("success", "", t("user_edited"), 3000);
      router.push({ name: "users" });
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
