<script setup lang="ts">
import Table from "@/utils/Table.vue";
import { table_configs } from "./table_config";
import MultiSelect from "primevue/multiselect";
import { ref } from "vue";
import Dropdown from "primevue/dropdown";
import { useToastStorage } from "@/stores/ToasterStorage";
import { useI18n } from "vue-i18n";
import { TestimonyStatus } from "@/services/Testimony/Testimony.service";
import { useTestimonyService } from "@/composables/Testimony/useTestimonyService";
import { ITestimony } from "@/services/Testimony/Testimony.service";

import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Tooltip from "primevue/tooltip";
import Avatar from "primevue/avatar";

// Añade estas variables reactivas
const selectedTestimony = ref<ITestimony | null>(null);
const detailModalVisible = ref(false);

// Añade esta función
const openDetails = (testimony: ITestimony) => {
  selectedTestimony.value = testimony;
  detailModalVisible.value = true;
};

const service = useTestimonyService();

const table = ref();

const refresh = () => {
  table.value.refresh();
};

const { notify } = useToastStorage();
const { t } = useI18n();

const changeTestimonyStatuses = async (
  testimony_id: number,
  new_status: TestimonyStatus,
) => {
  const error = await service.update(testimony_id, { status: new_status });
  if (!error) {
    refresh();
    notify("success", t("testimony_edited"), t("changes_saved"), 3000);
  } else {
    notify("error", t("an_error_ocurred"), error.message, 3000);
  }
};

function formatDate(date_str: string) {
  const date = new Date(date_str);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const statuses = Object.keys(TestimonyStatus);
const aviable_statuses = (status) => {
  void status;
  return statuses;
};
</script>
<template>
  <div>
    <Table ref="table" :dataService="service" :columns="table_configs">
      <template #header>
        <h1 class="">Testimonios</h1>
      </template>

      <template #column-actions="{ data }">
        <div class="flex justify-center">
          <Button
            @click="openDetails(data)"
            icon="pi pi-eye"
            class="p-button-text p-button-rounded !text-[#6f2465] hover:!bg-[#6f2465]/10"
            v-tooltip.bottom="'Ver detalles'"
          />
        </div>
      </template>

      <template #column-created_at="{ data }">
        <span v-if="data && data.created_at" class="text-md text-gray-700">
          {{ formatDate(data.created_at) }}
        </span>
      </template>

      <template #column-status="{ data }">
        <p v-if="data && data.status" class="text-md text-gray-700">
          <Dropdown
            :model-value="data.status"
            display="chip"
            id="statuses"
            :options="aviable_statuses(data.status)"
            class="min-w-36 !border-none !bg-transparent hover:!!border-gray-400"
            @change="changeTestimonyStatuses(data.id, $event.value)"
          >
            <template #value="slotProps">
              <div class="flex align-items-center">
                <div>{{ $t(`testimony_status.${slotProps.value}`) }}</div>
              </div>
            </template>
            <template #option="slotProps">
              <div class="flex align-items-center">
                <div>{{ $t(`testimony_status.${slotProps.option}`) }}</div>
              </div>
            </template>
          </Dropdown>
        </p>
      </template>

      <template #filter-status="{ filterModel, filterCallback }">
        <MultiSelect
          v-model="filterModel.value"
          display="chip"
          id="statuses"
          :options="statuses"
          class="min-w-36"
          @change="filterCallback"
        >
          <template #chip="slotProps">
            <div class="flex align-items-center">
              <div>{{ $t(`testimony_status.${slotProps.value}`) }}</div>
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex align-items-center">
              <div>{{ $t(`testimony_status.${slotProps.option}`) }}</div>
            </div>
          </template>
        </MultiSelect>
      </template>
    </Table>

    <Dialog
      v-model:visible="detailModalVisible"
      header="Detalles del Testimonio"
      :style="{ width: '90vw', maxWidth: '700px' }"
      :modal="true"
    >
      <div v-if="selectedTestimony" class="grid gap-4">
        <!-- Sección Laico -->
        <div class="col-12 flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
          <Avatar
            v-if="selectedTestimony.laic_?.image"
            :image="selectedTestimony.laic_.image"
            size="large"
            shape="circle"
          />
          <div>
            <h3 class="font-bold text-[#6f2465]">Laico asociado</h3>
            <p class="text-gray-600">
              {{ selectedTestimony.laic_?.name || "Sin laico asignado" }}
            </p>
          </div>
        </div>

        <!-- Información principal -->
        <div class="col-12 grid gap-y-4">
          <div class="col-6">
            <label class="block text-sm font-medium text-[#6f2465]"
              >Nombre</label
            >
            <p class="text-gray-700">
              {{
                selectedTestimony.name == null || selectedTestimony.name == ""
                  ? "anonimo"
                  : selectedTestimony.name
              }}
            </p>
          </div>

          <div class="col-6">
            <label class="block text-sm font-medium text-[#6f2465]"
              >Fecha</label
            >
            <p class="text-gray-700">
              {{ formatDate(selectedTestimony.created_at) }}
            </p>
          </div>

          <div class="col-6" v-if="selectedTestimony.laic_involved">
            <label class="block text-sm font-medium text-[#6f2465]"
              >Personas involucradas</label
            >
            <p class="text-gray-700">{{ selectedTestimony.laic_involved }}</p>
          </div>

          <div class="col-12">
            <label class="block text-sm font-medium text-[#6f2465]"
              >Descripción</label
            >
            <p v-if="selectedTestimony.text" class="text-gray-700">
              {{ selectedTestimony.text }}
            </p>
            <p v-else class="text-gray-500">Sin descripción</p>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>
