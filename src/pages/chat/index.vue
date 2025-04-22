<!-- src/components/ChatApp.vue -->
<template>
  <div class="h-[80dvh]">
    <!-- Header de controles para tablet/móvil -->
    <div class="flex items-center justify-between p-4 bg-gray-200 lg:hidden">
      <button
        @click="showChatList = !showChatList"
        class="p-2 text-lime-400 rounded md:hidden"
      >
        <i class="pi pi-comments"></i>
      </button>
      <span></span>
      <button
        @click="showChatNotes = !showChatNotes"
        class="p-2 text-blue-500 rounded"
      >
        <i class="pi pi-paperclip"></i>
      </button>
    </div>

    <!-- Vista escritorio: Tres columnas siempre visibles -->
    <div class="hidden md:grid layout min-h-screen">
      <!-- Columna izquierda: Lista de Chats -->
      <div class="border-r grid-area-chats">
        <ChatList
          @selected="selectedChat = $event"
          :chat-changes="chat_details"
        />
      </div>
      <!-- Columna central: Ventana de Chat -->
      <div class="grid-area-messages w-full">
        <ChatWindow
          class="!h-[90vh] w-full"
          :selectedChat="selectedChat"
          :chat-details="chat_details"
        />
      </div>
      <!-- Columna derecha: Notas y configuración -->
      <div class="border-l grid-area-notes hidden lg:block">
        <ChatNotes
          class="!h-[90vh]"
          :selectedChat="selectedChat"
          @updated_chat="chat_details = $event"
        />
      </div>
    </div>

    <!-- Vista tablet/móvil: Solo se muestra la ventana de chat -->
    <div class="md:hidden">
      <ChatWindow :selectedChat="selectedChat" :chat-details="chat_details" />
    </div>

    <!-- Sidebar para la lista de chats en tablet/móvil -->
    <Sidebar v-model:visible="showChatList" position="left" :baseZIndex="1000">
      <ChatList
        @selected="selectedChat = $event"
        :chat-changes="chat_details"
      />
    </Sidebar>

    <!-- Sidebar para las notas en tablet/móvil -->
    <Sidebar
      v-model:visible="showChatNotes"
      position="right"
      :baseZIndex="1000"
    >
      <ChatNotes
        :selectedChat="selectedChat"
        @updated_chat="chat_details = $event"
      />
    </Sidebar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Sidebar from "primevue/sidebar";
import ChatList from "@/components/Chat/ChatLister.vue";
import ChatWindow from "@/components/Chat/ChatWindow.vue";
import ChatNotes from "@/components/Chat/ChatNotes.vue";
import { useChatStore } from "@/stores/chatStore";
const showChatList = ref(false);
const showChatNotes = ref(false);
const selectedChat = ref(null);
const chat_details = ref(null);

const chatStore = useChatStore();
onMounted(() => {
  chatStore.enableMessageListenning();
});
</script>

<style scoped>
.layout {
  grid-template-columns: 1fr 2.5fr 1fr;
  grid-template-areas: "chats messages notes";
  @apply min-h-screen;
  @apply w-full;
  @apply box-border;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 0fr 2.5fr 0fr;
    grid-template-areas: "chats messages notes";
    @apply min-h-screen;
  }
}
@media (max-width: 1000px) {
  .layout {
    grid-template-columns: 1fr 2.5fr;
    grid-template-areas: "chats messages ";
    @apply min-h-screen;
  }
}
</style>
