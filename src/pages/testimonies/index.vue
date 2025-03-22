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
import { Permission } from "@/utils/Permissions";
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
  console.log(error);
  if (!error) {
    refresh();
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
  </div>
</template>
