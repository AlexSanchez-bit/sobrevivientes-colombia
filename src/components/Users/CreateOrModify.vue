<template>
  <div class="card relative">
    <div
      class="absolute w-full h-full flex justify-center items-center z-10"
      v-if="loading"
    >
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>

    <header
      class="bg-darkblue text-wood font-albra-serif-bold py-5 text-3xl rounded-t-lg text-center px-4"
    >
      <h1 class="text-md">
        {{ props.mode === "create" ? $t("user_creation") : $t("user_edition") }}
      </h1>
    </header>
    <TabView>
      <TabPanel :header="$t('general_info')">
        <UserForm
          :mode="props.mode"
          :user_id="props.user_id"
          :createdCb="onCreated"
        />
      </TabPanel>
      <TabPanel :header="$t('claims')">
        <PermissionSelector
          ref="claims"
          :mode="props.mode"
          :user_id="props.user_id"
        />
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import UserForm from "./UserForm.vue";
import PermissionSelector from "./PermissionSelector.vue";
import { ref } from "vue";
const claims = ref(null);
interface Props {
  mode: "create" | "edit";
  user_id?: string;
}

const loading = ref(false);
function onCreated(id: string) {
  claims.value?.save(id);
}

const props = defineProps<Props>();
</script>
