import { supabase } from "@/setup";
import { TableCrudService } from "@/utils/service/TableCrudService";

export interface ITrainData {
  document_name: string;
  total_chunks: number;
  example_content: string;
}

export class BotService extends TableCrudService<ITrainData> {
  constructor() {
    super("train_document", ["*"]);
  }

  async delete(document_name: string) {
    return await supabase
      .from("document_chunks")
      .delete()
      .eq("document_name", document_name);
  }

  async train(fileName: string) {
    return await supabase.functions.invoke("train_chatbot", {
      method: "POST",
      body: {
        fileName,
      },
    });
  }
}
