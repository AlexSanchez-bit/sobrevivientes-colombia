import { CurrencyService } from "@/services/Currency/Currency.service";

const currencyService = new CurrencyService();

export const useCurrencyService = () => currencyService;
