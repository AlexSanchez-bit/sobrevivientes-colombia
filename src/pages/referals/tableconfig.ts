
import { ColumnData } from "@/utils/entities/ColumnData";
import { FilterMatchMode } from "primevue/api";
export const table_configs: ColumnData[] = [
  {
    field: "actions",
    header: "actions",
  },
  {
    field: "id",
    header: "number",
    filter: {
      matchMode: FilterMatchMode.EQUALS,
      value: null,
    },
    sorteable: true,
    dataType: "numeric",
  },

  {
    field: "status",
    header: "status",
    filter: {
      matchMode: FilterMatchMode.IN,
      value: null,
    },
    showFilterOptions: false,
    sorteable: false,
  },
  {
    field: "created_at",
    header: "created_at",
    filter: {
      matchMode: FilterMatchMode.BETWEEN,
      value: null,
    },
    sorteable: true,
    dataType: "date",
  },
];
