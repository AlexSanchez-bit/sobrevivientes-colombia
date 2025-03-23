<script setup lang="ts">
import Actions from "@/components/Users/Actions.vue";
import Avatar from "primevue/avatar";
import Table from "@/utils/Table.vue";
import { table_configs } from "./tableconfig";
import Button from "primevue/button";
import { ref } from "vue";
import { useBlogEntrieService } from "@/composables/BlogEntrie/useBlogEntrieService";
const service = useBlogEntrieService();
function formatDate(date_str: string) {
  const date = new Date(date_str);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}
import { Permission } from "@/utils/Permissions";

const table = ref();

const refresh = () => {
  table.value.refresh();
};
</script>
<template>
  <div>
    <Table ref="table" :dataService="service" :columns="table_configs">
      <template #header>
        <h1 class="">Entradas del Blog</h1>
      </template>

      <template #toolbar>
        <router-link
          v-permission="[Permission.WRITE_BLOG_ENTRIES]"
          to="blog-entries/create"
        >
          <Button
            icon="pi pi-plus"
            v-tooltip.bottom="{
              value: 'Crear Entrada al blog',
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
          :editRoute="`/blog-entries/${data.id}/edit`"
          :delete-cb="service"
          @removed="refresh"
          v-if="data"
        ></Actions>
      </template>
      <template #column-name="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          <router-link
            :to="`users/${data.user.id}/edit`"
            class="text-md text-blue-900 underline"
          >
            {{ data?.user.name }}
          </router-link>
        </div>
      </template>
      <template #column-image="{ data }">
        <div v-if="data" class="flex flex-row items-center">
          <Avatar
            :image="data?.image"
            class="mr-2 !rounded-none"
            size="large"
          />
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
