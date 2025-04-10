<template>
  <div class="p-4 h-full flex flex-col bg-white rounded shadow">
    <div
      ref="messageContainer"
      class="flex-grow overflow-auto space-y-3 pr-2 h-[65vh]"
    >
      <TransitionGroup name="fade" tag="div">
        <div
          v-for="msg in formattedMessages"
          :key="msg.id"
          class="max-w-[75%] p-3 rounded-xl shadow-sm transition-all my-3"
          :class="{
            'mr-auto bg-darkblue/80 text-white':
              msg.is_human && msg.user != userData.id,
            'mr-auto bg-purple-900/70 text-white': msg.user == null,
            'ml-auto bg-darkblue/60 text-white':
              msg.is_human && msg.user == userData.id,
          }"
        >
          <p
            v-if="msg.is_human && msg.user != userData.id"
            class="text-sm leading-relaxed"
          >
            {{ chatDetails?.name }}
          </p>
          <NuxtLink
            v-if="msg.is_human && msg.user == userData.id"
            :to="`/users/${msg.user}/edit`"
          >
            <p class="text-sm leading-relaxed">soporte</p>
          </NuxtLink>

          <p v-if="!msg.user" class="text-sm leading-relaxed">
            bot <i class="pi pi-microchip-ai"></i>
          </p>
          <span
            class="text-sm max-w-[75%] h-auto leading-relaxed text-justify break-words"
          >
            {{ msg.content }}
          </span>

          <br />
          <span class="flex flex-row justify-end w-full">
            <i
              class="pi"
              :class="{
                'pi-clock': msg.status == CHATSTATUS.DELIVERED,
                'pi-check': msg.status == CHATSTATUS.SENT,
                'pi-x-mark': msg.status == CHATSTATUS.ERROR,
              }"
            >
            </i>
          </span>
        </div>
      </TransitionGroup>
    </div>

    <div class="mt-4 flex gap-2 items-center">
      <InputText
        v-model="message"
        placeholder="Escribe un mensaje..."
        class="flex-1"
        :disabled="loading || !chatDetails?.human_driven"
        @keyup.enter="sendMessage"
      />
      <Button
        :loading="loading"
        :disabled="!chatDetails?.human_driven"
        icon="pi pi-send"
        class="p-button-rounded p-button-sm"
        @click="sendMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs, nextTick, computed, onMounted } from "vue";
import { useChatService } from "@/composables/Chat/useChatService";
import { CHATSTATUS, type IChatMessage } from "@/services/Chat/Chat.service";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useAuthStore } from "@/stores/AuthStore";
import { useChatStore } from "@/stores/chatStore";

const props = defineProps<{ selectedChat: number | null; chatDetails: any }>();
const { selectedChat, chatDetails } = toRefs(props);

const loading = ref(false);

const service = useChatService();
const messages = ref<IChatMessage[]>([]);
const message = ref("");
const messageContainer = ref<HTMLElement | null>(null);
const { userData } = useAuthStore();

window.addEventListener("focus", async function () {
  const nv = selectedChat.value;
  if (nv !== null) {
    loading.value = true;
    const { data, error } = await service.getChatMessages(nv, 0, 1000);
    loading.value = false;
    if (!error && data) {
      messages.value = data.reverse();
      scrollToBottom();
    }
  } else {
    messages.value = [];
  }
});

watch(selectedChat, async (nv) => {
  if (nv !== null) {
    loading.value = true;
    const { data, error } = await service.getChatMessages(nv, 0, 1000);
    loading.value = false;
    if (!error && data) {
      messages.value = data.reverse();
      scrollToBottom();
    }
  } else {
    messages.value = [];
  }
});

const sendMessage = async () => {
  if (!message.value.trim() || selectedChat.value === null) return;

  const newMsg: IChatMessage = {
    user: userData.id,
    chat_id: selectedChat.value,
    content: message.value,
    is_human: true,
    status: CHATSTATUS.DELIVERED,
  };

  messages.value.push(newMsg);
  const index = messages.value.length - 1;
  message.value = "";
  scrollToBottom();

  loading.value = true;
  const { data: resp } = await service.sendMessage(newMsg);

  loading.value = false;
  if (resp.error) {
    messages.value[index].status = CHATSTATUS.ERROR;
    return;
  }
  messages.value[index].status = CHATSTATUS.SENT;
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const formattedMessages = computed(() => messages.value ?? []);

const store = useChatStore();

store.callbackList.push((payload) => {
  if (payload.chat_id == selectedChat.value && payload.user != userData.id) {
    messages.value.push(payload);
    scrollToBottom();
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
