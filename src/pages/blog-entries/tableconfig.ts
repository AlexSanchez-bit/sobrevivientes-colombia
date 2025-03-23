import { ColumnData } from "@/utils/entities/ColumnData";
import { FilterMatchMode } from "primevue/api";
export const table_configs: ColumnData[] = [
  {
    field: "actions",
    header: "actions",
  },
  {
    field: "name",
    header: "Usuario",
    filter: {
      matchMode: FilterMatchMode.CONTAINS,
      value: null,
    },
    filter_field: "user.name",
    sorteable: false,
  },
  {
    field: "title",
    header: "Título",
    filter: {
      matchMode: FilterMatchMode.CONTAINS,
      value: null,
    },
    sorteable: false,
  },
  {
    field: "created_at",
    header: "created_at",
    filter: { value: null, matchMode: FilterMatchMode.EQUALS },
    sorteable: true,
    dataType: "date",
  },
  { field: "image", header: "Imagen" },
];
