<script setup lang="ts">
import Actions from "@/components/Users/Actions.vue";
import Avatar from "primevue/avatar";
import Table from "@/utils/Table.vue";
import { table_configs } from "./tableconfig";
import Button from "primevue/button";
import { ref } from "vue";
import { Permission } from "@/utils/Permissions";
import { useAllieService } from "@/composables/Allie/useAllieService";
const service = useAllieService();
function formatDate(date_str: string) {
  const date = new Date(date_str);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const table = ref();

const refresh = () => {
  table.value.refresh();
};
</script>
<template>
  <div>
    <Table ref="table" :dataService="service" :columns="table_configs">
      <template #header>
        <h1 class="">Aliados</h1>
      </template>

      <template #toolbar>
        <router-link v-permission="[Permission.WRITE_ALLIES]" to="allies/create">
          <Button icon="pi pi-plus" v-tooltip.bottom="{
            value: 'Agregar Aliado',
            showDelay: 100,
            hideDelay: 300,
          }" severity="secondary" text rounded outlined />
        </router-link>
      </template>

      <template #column-actions="{ data }" v-permission="[Permission.WRITE_ALLIES]">
        <Actions :id="data.id" :editRoute="`/allies/${data.id}/edit`" :delete-cb="service" @removed="refresh"
          v-if="data"></Actions>
      </template>
      <template #column-link="{ data }">
        <div v-if="data" class="">
          <a :href="data.link" target="_blank" class="text-blue-400 underline max-w-64 truncate">
            {{ data.link }}
          </a>
        </div>
      </template>
      <template #column-name="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          {{ data?.name }}
        </div>
      </template>
      <template #column-icon="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          <Avatar :image="data?.icon" class="mr-2" size="large" />
        </div>
      </template>

      <template #column-created_at="{ data }">
        <div v-if="data && data.created_at">
          {{ formatDate(data.created_at) }}
        </div>
      </template>
    </Table>
  </div>
</template>
