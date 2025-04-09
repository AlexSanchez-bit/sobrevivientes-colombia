import { ChatService } from "@/services/Chat/Chat.service";

const chatService = new ChatService();

export const useChatService = () => chatService;
