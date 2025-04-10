<template>
  <div
    class="p-1 rounded-xl hover:bg-gray-100 cursor-pointer flex justify-between items-center"
    @click="update_unread"
  >
    <div>
      <h3 class="font-bold text-lg">{{ chat.name }}</h3>

      <p
        v-if="chat.last_message"
        class="text-sm text-gray-600 mt-1 line-clamp-2"
      >
        {{ chat.last_message }}
      </p>
    </div>
    <div class="flex flex-col items-end">
      <span
        v-if="chat.unread_message > 0"
        class="bg-blue-500 text-white rounded-full px-2 py-1 text-xs"
      >
        {{ chat.unread_message }}
      </span>
      <span v-else class="text-gray-400 text-xs">Leído</span>
      <p class="text-xs text-gray-500 mt-1">
        {{ chat.human_driven ? "Humano" : "Automático" }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";

import { type IChat } from "@/services/Chat/Chat.service";
import { useChatService } from "@/composables/Chat/useChatService";

const props = defineProps<{
  chat: IChat;
}>();

const { chat } = props;
const service = useChatService();

async function update_unread() {
  emit("selected", chat.id);
  chat.unread_message = 0;
  const resp = await service.update(chat.id, { unread_message: 0 });
  console.log(resp);
}

const emit = defineEmits<{
  (e: "selected", id: number);
}>();
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>
