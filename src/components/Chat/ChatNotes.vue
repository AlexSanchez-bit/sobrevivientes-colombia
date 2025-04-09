<template>
  <form class="p-4" @input="submit">
    <h2 class="text-xl font-bold mb-4">Notas y Configuración</h2>
    <div>
      <label for="humandriven" class="block mb-2">Chat con humano:</label>
      <InputSwitch
        binary
        v-model="form.human_driven"
        color="darkblue"
        id="humandriven"
        :loading="loading"
        :disabled="!selectedChat"
      />
    </div>
    <div>
      <label for="name" class="block mb-2">Nombre del Chat:</label>
      <InputText
        :disabled="!selectedChat"
        :loading="loading"
        id="name"
        type="text"
        v-model="form.name"
        placeholder="Nombre del chat"
        class="w-full p-2 border rounded"
      />
    </div>
    <div class="mt-4">
      <label class="block mb-2">Notas Rápidas:</label>
      <Textarea
        :disabled="!selectedChat"
        :loading="loading"
        v-model="form.notes"
        rows="4"
        placeholder="Agrega notas rápidas"
        class="w-full p-2 border rounded"
      ></Textarea>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useChatService } from "@/composables/Chat/useChatService";
import type { IChat } from "@/services/Chat/Chat.service";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { reactive, ref, toRefs, watch } from "vue";

const emit = defineEmits<{
  (e: "updated_chat", chat: Partial<IChat>);
}>();
const props = defineProps<{
  selectedChat: number | null;
}>();

const { selectedChat } = toRefs(props);

const service = useChatService();

const form = reactive({
  notes: "",
  human_driven: false,
  name: "",
});

watch(selectedChat, async (nv) => {
  const { data, error } = await service.getDetails(nv);
  if (!error) {
    emit("updated_chat", data);
    form.notes = data.notes;
    form.human_driven = data.human_driven;
    form.name = data.name;
  }
});

const loading = ref(false);

const lastTimeout = ref<any>(-1);
const submit = async () => {
  if (lastTimeout.value != -1) clearTimeout(lastTimeout.value);
  lastTimeout.value = setTimeout(async () => {
    loading.value = true;
    const resp = await service.update(selectedChat.value, { ...form });
    loading.value = false;
    if (!resp) {
      emit("updated_chat", {
        id: selectedChat.value,
        ...form,
      });
    }
  }, 600);
};
</script>

<style scoped>
/* Estilos específicos para el componente de notas */
</style>
