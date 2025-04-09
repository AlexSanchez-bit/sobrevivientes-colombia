<template>
  <div class="p-1">
    <h2 class="text-xl font-bold mb-4">Chats</h2>
    <LazyLoadScroll
      ref="scroller"
      class="!h-[80dvh] !overflow-y-auto"
      :service="lister_service"
      displayClass="flex flex-col gap-2 "
      :filter="[]"
      :order="[
        {
          field: 'unread_message',
          order: 0,
        },
      ]"
    >
      <template #item="{ item }">
        <div class="p-2 border rounded hover:bg-gray-100 cursor-pointer">
          <ChatElement :chat="item" @selected="changeSetedChat" />
        </div>
      </template>

      <template #empty>
        <h6 class="w-full text-center">No hay chats disponibles</h6>
      </template>
    </LazyLoadScroll>
  </div>
</template>

<script setup lang="ts">
import LazyLoadScroll from "@/components/LazyLoadScroll.vue";
import { useChatService } from "@/composables/Chat/useChatService";
import ChatElement from "./ChatElement.vue";
import { toRefs, ref, watch } from "vue";
import { useChatStore } from "@/stores/chatStore";
import type { IChat } from "@/services/Chat/Chat.service";

const emit = defineEmits<{
  (e: "selected", id: number);
}>();

const props = defineProps<{
  chatChanges: any;
}>();

const { chatChanges } = toRefs(props);
const selectedChat = ref(null);
const changeSetedChat = (id: number) => {
  const elemIndex = scroller.value?.items.findIndex((item) => (item.id = id));
  const chat = scroller.value?.items[elemIndex];
  selectedChat.value = chat.id;
  emit("selected", chat.id);
};

const store = useChatStore();

store.callbackList.push((payload) => {
  scroller.value?.apply_filters();
});

watch(chatChanges, (nv) => {
  const elemIndex = scroller.value?.items.findIndex(
    (item) => (item.id = nv.id),
  );
  scroller.value.items[elemIndex].name = nv.name;
});

window.addEventListener("focus", function () {
  scroller.value?.apply_filters();
});

const service = useChatService();

const scroller = ref();

const lister_service = {
  async getAllTotalCount(filters: [], pagination: any, orders: []) {
    return await service.getAllTotalCount(filters, pagination, orders);
  },
};
</script>

<style scoped>
/* Estilos específicos para este componente */
</style>
