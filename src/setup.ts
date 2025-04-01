import { createI18n } from "vue-i18n";

import es from "./locales/es.json";
import en from "./locales/en.json";
import co from "./locales/co.json";

export const i18n = createI18n({
  legacy: false,
  locale: "es",
  messages: { es, en, co },
});

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL!;
const supabaseKey = (import.meta as any).env.VITE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log(supabaseUrl, supabaseKey);
console.log(supabase);
