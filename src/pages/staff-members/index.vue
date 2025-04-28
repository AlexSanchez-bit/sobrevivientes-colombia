<script setup lang="ts">
import Actions from "@/components/Users/Actions.vue";
import Avatar from "primevue/avatar";
import Table from "@/utils/Table.vue";
import { table_configs } from "./table_config";
import Button from "primevue/button";
import { ref } from "vue";
import { Permission } from "@/utils/Permissions";
import { useStaffService } from "@/composables/StaffMember/useStaffMember";
const service = useStaffService();
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
        <h1 class="">Miembros del Staff</h1>
      </template>

      <template #toolbar>
        <router-link
          v-permission="[Permission.WRITE_STAFF_MEMBERS]"
          to="staff-members/create"
        >
          <Button
            icon="pi pi-plus"
            v-tooltip.bottom="{
              value: 'Agregar Miembro del Staff',
              showDelay: 100,
              hideDelay: 300,
            }"
            severity="secondary"
            text
            rounded
            outlined
          />
        </router-link>
      </template>

      <template #column-actions="{ data }">
        <Actions
          :id="data.id"
          :editRoute="`/staff-members/${data.id}/edit`"
          :delete-cb="service"
          @removed="refresh"
          v-if="data"
        ></Actions>
      </template>
      <template #column-profile_link="{ data }">
        <div v-if="data" class="">
          <a
            :href="data.profile_link"
            target="_blank"
            class="text-blue-400 underline max-w-64 truncate"
          >
            {{ data.profile_link }}
          </a>
        </div>
      </template>
      <template #column-name="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          {{ data?.name }}
        </div>
      </template>
      <template #column-picture="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          <Avatar :image="data?.picture" class="mr-2" size="large" />
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
