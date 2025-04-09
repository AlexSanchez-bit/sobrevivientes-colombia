import { supabase } from "@/setup";
import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./AuthStore";

export const useChatStore = defineStore("chatstore", () => {
  const channel = ref<any>();

  const { userData: user } = storeToRefs(useAuthStore());

  type callback = (param: any) => void;
  const callbackList = ref<callback[]>([]);

  const enableMessageListenning = () => {
    channel.value = supabase.channel("chat_messages");
    channel.value.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "chat_message" },
      (payload) => {
        callbackList.value.forEach((cb) => {
          cb(payload.new);
        });
      },
    );
    channel.value.subscribe();
  };

  return { enableMessageListenning, callbackList };
});
