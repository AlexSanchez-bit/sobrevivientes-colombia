import { supabase } from "@/setup";
import { TableCrudService } from "@/utils/service/TableCrudService";

export enum CHATSTATUS {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  SEEN = "SEEN",
  ERROR = "ERROR",
}

export interface IChat {
  id?: number;
  created_at: Date;
  name: string;
  human_driven: boolean;
  last_message: string;
  unread_message: number;
  notes: string;
}

export interface IChatMessage {
  user?: string;
  chat_id: number;
  id?: number;
  content: string;
  is_human: boolean;
  status: CHATSTATUS;
}

export class ChatService extends TableCrudService<IChat> {
  constructor() {
    super("chat", ["*"]);
  }

  async getChatMessages(chat_id: number, from: number, to: number) {
    return await supabase
      .from("chat_message")
      .select("*")
      .eq("chat_id", chat_id)
      .order("created_at", { ascending: false });
  }

  async sendMessage(msg: IChatMessage) {
    return await supabase.functions.invoke("send_message", {
      method: "POST",
      body: {
        chat_id: msg.chat_id,
        content: msg.content,
      },
    });
  }
}
