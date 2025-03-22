<template>
  <div class="flex flex-row gap-4">
    <Button
      v-tooltip="$t('remove')"
      icon="pi pi-trash"
      severity="danger"
      rounded
      aria-label="Cancel"
      @click="confirmDelete"
    />
    <slot>
      <router-link :to="props.editRoute">
        <Button
          v-tooltip="$t('edit')"
          icon="pi pi-pencil"
          severity="help"
          rounded
          aria-label="Favorite"
          @click="edit_visible = true"
        />
      </router-link>
    </slot>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useI18n } from "vue-i18n";
import type { IGenericRemove } from "@/utils/service/IGenericCrud";

const { t } = useI18n();
const confirm = useConfirm();

const emit = defineEmits<{
  (e: "removed");
}>();

interface Props {
  id: string | number;
  deleteCb: IGenericRemove<any>;
  editRoute?: string;
}
const props = defineProps<Props>();
const edit_visible = ref(false);

const loading = ref(false);

const confirmDelete = () => {
  confirm.require({
    message: t("are_you_shure_to_delete"),
    header: "",
    icon: "pi pi-info-circle",
    rejectLabel: t("Cancel"),
    acceptLabel: t("Delete"),
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-danger",
    accept: async () => {
      loading.value = true;
      const error = await props.deleteCb.remove(props.id);
      loading.value = false;
      if (!error) {
        emit("removed");
      }
    },
    reject: () => {},
  });
};
</script>

<style>
.p-button.p-button-help {
  background-color: var(--primary-color-grass) !important;
  border-color: var(--primary-color-sea) !important;
  color: var(--primary-color-wood) !important;
}
</style>
