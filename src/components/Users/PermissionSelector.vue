<template>
  <div class="flex justify-center items-center p-4">
    <!-- Tarjeta Principal -->
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <!-- Título -->
      <h2 class="text-2xl font-semibold text-center mb-6 text-gray-800">
        {{ $t("permission_selector") }}
      </h2>

      <!-- Dropdown y Botón para Agregar -->
      <div class="flex gap-4 mb-6">
        <Dropdown
          :loading="loading"
          v-model="selectedPermission"
          :options="availablePermissions"
          optionLabel="name"
          :placeholder="$t('select_a_claim')"
          class="flex-1"
        >
          <template #value="slotProps">
            <div class="flex align-items-center" v-if="slotProps.value">
              <div>{{ $t("permissions." + slotProps.value.name) }}</div>
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex align-items-center" v-if="slotProps.option">
              <div>{{ $t("permissions." + slotProps.option.name) }}</div>
            </div>
          </template>
        </Dropdown>
        <Button
          :label="$t('add')"
          icon="pi pi-plus"
          class="p-button-primary"
          @click="addPermission"
        />
      </div>

      <!-- Permisos Seleccionados -->
      <div>
        <h3 class="text-lg font-medium text-gray-700 mb-4">
          {{ $t("selected_claims") }}
        </h3>
        <div
          class="flex flex-wrap gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <span
            v-for="permission in selectedPermissions"
            :key="permission.id"
            class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm cursor-pointer hover:bg-blue-200 transition"
            @click="removePermission(permission)"
          >
            {{ $t("permissions." + permission.name) }}
            <i class="pi pi-times"></i>
          </span>
        </div>
      </div>
      <Button
        v-if="mode != 'create'"
        @click="save"
        :label="$t('save')"
        class="mx-auto my-3 w-full"
        :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import { useUserPermisionService } from "@/composables/Users/useUserPermisionService";

import { useToastStorage } from "@/stores/ToasterStorage";
import { useI18n } from "vue-i18n";
const { notify } = useToastStorage();

// Interfaz para permisos
interface Permission {
  id: number;
  name: string;
}

interface Props {
  mode: "create" | "edit";
  user_id?: string;
}

const props = defineProps<Props>();
const { mode, user_id } = props;

const service = useUserPermisionService();
const loading = ref(false);

// Permisos disponibles (simula datos de un backend o API)
const allPermissions = ref<Permission[]>([]);
const selectedPermissions = ref<Permission[]>([]); // Permisos seleccionados
const selectedPermission = ref<Permission | null>(null); // Permiso seleccionado en el Dropdown
let originalPermissions = [] as Permission[];

const availablePermissions = computed(() => {
  return allPermissions.value.filter(
    (p) => !selectedPermissions.value.some((sp) => sp.id == p.id),
  );
});

onMounted(async () => {
  loading.value = true;
  const { data, error } = await service.getAll(0, 0, {});
  loading.value = false;
  if (!error) {
    allPermissions.value = data;
  }
  if (mode == "edit") {
    const { data, error } = await service.getUserPermissions(user_id!);
    if (!error) {
      const tmp = data.map((claim: any) => claim.permission) as Permission[];
      selectedPermissions.value = tmp;
      originalPermissions = [...tmp];
    }
  }
});

const { t } = useI18n();

// Agregar un permiso
function addPermission() {
  if (selectedPermission.value) {
    // Verifica si el permiso ya está seleccionado
    const exists = selectedPermissions.value.some(
      (p) => p.id === selectedPermission.value!.id,
    );
    if (!exists) {
      selectedPermissions.value.push(selectedPermission.value);
    }
    // Limpia el Dropdown después de agregar
    selectedPermission.value = null;
  }
}

// Eliminar un permiso
function removePermission(permission: Permission) {
  selectedPermissions.value = selectedPermissions.value.filter(
    (p) => p.id !== permission.id,
  );
}

async function save(id?: string) {
  loading.value = true;
  const _resp = await service.saveUserPermissions(
    user_id ?? id,
    selectedPermissions.value.map((p) => p.id),
    originalPermissions.map((p) => p.id),
  );
  loading.value = false;

  notify("success", t("permissions_updated"), "", 3000);
}

defineExpose({
  save,
});
</script>

<style scoped>
/* Estilo adicional para hacerlo más atractivo */
.min-h-screen {
  min-height: 100vh;
}

.bg-gray-100 {
  background-color: #f7f8fa;
}

.bg-blue-100 {
  background-color: #e6f4ff;
}

.text-blue-800 {
  color: #2563eb;
}

.bg-blue-200:hover {
  background-color: #cfe4ff;
}

.cursor-pointer {
  cursor: pointer;
}

.transition {
  transition: all 0.2s ease-in-out;
}
</style>
