import { ColumnData } from "@/utils/entities/ColumnData";
import { FilterMatchMode } from "primevue/api";
export const table_configs: ColumnData[] = [
  {
    field: "actions",
    header: "actions",
  },
  {
    field: "start_date",
    header: "Fecha de Inicio",
    filter: { value: null, matchMode: FilterMatchMode.EQUALS },
    sorteable: true,
    dataType: "date",
  },
  {
    field: "end_date",
    header: "Fecha de Inicio",
    filter: { value: null, matchMode: FilterMatchMode.EQUALS },
    sorteable: true,
    dataType: "date",
  },
  {
    field: "image",
    header: "Imagen",
    sorteable: false,
  },
  {
    field: "redirection_url",
    header: "URL de redirección",
    filter: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sorteable: true,
  },
  {
    field: "redirection_text",
    header: "texto del botón",
    filter: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sorteable: true,
  },
];
