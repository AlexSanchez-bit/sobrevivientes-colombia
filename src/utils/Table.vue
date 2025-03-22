<template>
  <Dialog v-model:visible="advice_visible">
    <template #container="{ closeCallback }">
      <div class="flex flex-col gap-6 p-8">
        <h3 class="text-center text-2xl text-gray-600">
          Esta por exportar mas de 5000 datos
        </h3>
        <h4 class="text-center text-xl text-gray-600">
          Esta acción va a tomar un tiempo
        </h4>
        <div class="flex flex-col gap-3">
          <h4 class="text-center text-gray-600">
            ¿Aún quiere exportar los datos?
          </h4>
          <div class="flex flex-row gap-3 justify-between">
            <Button
              label="Cancelar"
              severity="secondary"
              @click="closeCallback"
            />
            <Button label="Exportar Datos" @click="exportCallBack" />
          </div>
        </div>
      </div>
    </template>
  </Dialog>
  <Dialog v-model:visible="negation_visible">
    <div class="w-96 flex flex-col gap-5">
      <h3 class="text-center text-2xl text-red-600">
        Demasiados datos Seleccionados
      </h3>
      <h3 class="text-center text-xl text-gray-600">
        Aplique algún filtro para exportar
      </h3>
    </div>
  </Dialog>
  <div class="flex-1">
    <DataTable
      lazy
      v-model:filters="filters!"
      size="small"
      resizableColumns
      removableSort
      sortMode="multiple"
      ref="dt"
      columnResizeMode="fit"
      :rows="size"
      showGridlines
      stripedRows
      paginator
      :totalRecords="totalCount!"
      :loading="loading"
      :rowsPerPageOptions="[10, 20, 30, 50]"
      :value="products!"
      @filter="loadFilters($event)"
      filterDisplay="row"
      :multiSortMeta="sortOrder!"
      @page="changePage($event)"
      @sort="loadSorter($event)"
      :globalFilterFields="globalFilters!"
      dataKey="id"
      tableStyle="min-width: 75rem"
    >
      <template #empty>
        <div class="mt-8 flex justify-center items-center w-screen h-screen">
          <p class="text-orange-500 text-center text-2xl w-full mr-6">
            No hay datos
          </p>
        </div>
      </template>
      <template #loading>
        <ProgressSpinner
          style="width: 50px; height: 50px; z-index: 900"
          strokeWidth="8"
          class="z-50"
          fill="var(--surface-ground)"
          animationDuration=".5s"
          aria-label="Custom ProgressSpinner"
        />
      </template>

      <template #header>
        <div class="flex flex-row justify-between w-full">
          <slot name="header">
            <div
              class="flex flex-wrap align-items-center justify-between gap-2"
            >
              <span class="text-xl text-900 font-bold">Tabla</span>
            </div>
          </slot>
          <div class="flex flex-row gap-2">
            <slot name="toolbar"></slot>

            <Button
              icon="pi pi-external-link"
              v-tooltip.bottom="{
                value: 'exportar como csv',
                showDelay: 100,
                hideDelay: 300,
              }"
              severity="secondary"
              text
              rounded
              outlined
              @click="exportCSV()"
            />

            <Button
              type="button"
              icon="pi pi-filter-slash"
              severity="secondary"
              text
              rounded
              outlined
              @click="clearFilter()"
              v-tooltip.bottom="{
                value: 'limpiar filtros',
                showDelay: 100,
                hideDelay: 300,
              }"
            />

            <Button
              icon="pi pi-refresh"
              @click="refresh"
              severity="secondary"
              text
              rounded
              outlined
              v-tooltip.bottom="{
                value: 'volver a cargar',
                showDelay: 100,
                hideDelay: 300,
              }"
            />
          </div>
        </div>
      </template>

      <Column
        v-for="column in columns"
        :key="column.field!"
        :sortable="column.sorteable!"
        :field="column.field!"
        :header="$t(column.header!)"
        filter="false"
        :dataType="column.dataType!"
        :filterField="column.filter_field!"
        style="width: max-content"
        :showFilterMenu="column.showFilterOptions"
      >
        <template #body="{ data }">
          <slot :name="`column-${column.field!}`" :data="data">
            <div v-if="data != null">
              {{
                Object.keys(data).includes(column.field)
                  ? data[column.field]
                  : ""
              }}
            </div>
            <div v-else class="h-8"></div>
          </slot>
        </template>

        <template
          v-if="column.filter && column.dataType !== 'date'"
          #filter="{ filterModel, filterCallback }"
        >
          <slot
            :name="`filter-${column.field}`"
            :filterModel="filterModel"
            :filterCallback="filterCallback"
          >
            <DefaultFilter
              v-model="filterModel.value"
              :on-input="
                () => {
                  restartPagination();
                  filterCallback();
                }
              "
              :dataType="column.dataType"
            />
          </slot>
        </template>
        <template v-else-if="column.filter!" #filter="{ filterCallback }">
          <div class="flex place-items-center gap-5">
            <div class="">
              <label class="mr-1 text-xs">Desde</label>
              <input
                class="px-2 text-xs py-1 shadow-lg rounded-md border-solid"
                type="date"
                v-model="dateFilters[column.field][0]"
                @input="
                  () => {
                    restartPagination();
                    filterCallback();
                  }
                "
              />
            </div>
            <div>
              <label class="mr-1 text-xs">Hasta</label>
              <input
                class="px-2 text-xs py-1 shadow-lg rounded-md border-solid"
                type="date"
                v-model="dateFilters[column.field][1]"
                @input="
                  () => {
                    restartPagination();
                    filterCallback();
                  }
                "
              />
            </div>
            <div>
              <i
                v-show="
                  dateFilters[column.field][0] || dateFilters[column.field][1]
                "
                class="pi pi-filter-slash cursor-pointer"
                @click="
                  dateFilters[column.field] = [null, null];
                  restartPagination();
                  filterCallback();
                "
              />
            </div>
          </div>
        </template>
      </Column>

      <template #footer>
        <slot name="footer"></slot>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, reactive } from "vue";
import DataTable, { type DataTableSortMeta } from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { TableService } from "./service/TableService";
import { Filter } from "./entities/Filter";
import { Pagination } from "./entities/Pagination";
import {
  ColumnData,
  FiltersDefinition,
  applyTransformation,
} from "./entities/ColumnData";
import ProgressSpinner from "primevue/progressspinner";
import { Sorter } from "./entities/Sorters";
import DefaultFilter from "./DefaultFilter.vue";
import { FilterMatchMode } from "primevue/api";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Dialog from "primevue/dialog";

const { dataService, columns } = defineProps<{
  dataService: TableService<any>;
  columns: ColumnData[];
}>();

const emit = defineEmits<{
  (
    e: "filtersChange",
    filters: { [key: string]: FiltersDefinition },
    dateFilters: { [key: string]: [Date, Date] },
  ): void;
}>();

const keys = ref([] as string[]);
const size = ref(10);
const loading = ref(false);
const totalCount = ref(0);
const sortOrder = ref<DataTableSortMeta[] | null>(null);
const products = ref();

const advice_visible = ref(false);
const negation_visible = ref(false);

const filters = ref<any>();
const dateFilters = ref<{ [key: string]: [Date, Date] }>({});

const globalFilters = ref<string[]>([]);

const pagination = reactive(new Pagination(0, size.value));
if (dataService.pagination != null) {
  pagination.page = dataService.pagination.page;
  pagination.ammount = dataService.pagination.ammount;
  size.value = dataService.pagination.ammount;
}

const getAllTotalCount = (
  filter: Filter<any>[],
  pagination: Pagination,
  order: Sorter[] | null = null,
) => {
  loading.value = true;
  dataService
    .getAllTotalCount(filter, pagination, order)
    .then((response: { data: any[]; totalCount: number }) => {
      totalCount.value = response.totalCount;
      const void_rows = pagination.ammount - response.data.length;
      for (let i = 0; i < void_rows; i++) {
        response.data.push(null);
      }
      products.value = response.data;
      if (products == null || products.value.length == 0) return;
      const aux = {} as any;
      Object.keys(products.value[0] ?? {}).forEach((ele) => {
        aux[ele] = typeof products.value[0][ele];
      });
      keys.value = Object.keys(aux);
      loading.value = false;
    })
    .catch((error: any) => {
      console.error(error);
      loading.value = false;
    });
};

let filtersToExport = {};
let filterTimeOut = null;
const loadFilters = (_filters: any) => {
  //if is filtered the same then return
  clearTimeout(filterTimeOut);
  filterTimeOut = setTimeout(() => {
    Object.keys(_filters.filters).forEach((f) => {
      if (_filters.filters[f] && filtersToExport[f]) {
        filtersToExport[f].matchMode = _filters.filters[f].matchMode ?? null;
        filtersToExport[f].value = _filters.filters[f].value ?? null;
      }
    });
    filters.value = _filters.filters;
    dataService.filters = _filters.filters;
    refresh();
  }, 500);
};
const loadFiltersToExport = () => {
  /* initFilter debe ser llamado primero */
  const savedFilters = dataService.filters;
  Object.keys(savedFilters).forEach((f) => {
    if (savedFilters[f] && filtersToExport[f]) {
      filtersToExport[f] = {
        matchMode: savedFilters[f].matchMode ?? null,
        value: savedFilters[f].value ?? null,
        filterQuery: filtersToExport[f].filterQuery ?? null,
      };
    }
  });
};

const loadSorter = (orders: any) => {
  sortOrder.value = orders.multiSortMeta;
  refresh();
};

const changePage = (_pagination: any) => {
  pagination.page = _pagination.page;
  pagination.ammount = _pagination.rows;
  refresh();
};

function buildFilters() {
  try {
    const tmp_filters = [];
    Object.keys(filters.value).forEach((filt) => {
      if (filters.value[filt].value) {
        const filter = new Filter<any>();
        filter.field = filt;
        filter.value = filters.value[filt].value;
        filter.matchMode = filters.value[filt].matchMode;
        tmp_filters.push(filter);
      }
    });

    Object.keys(dateFilters.value).forEach((key) => {
      const df = dateFilters.value[key];
      df[0] &&
        tmp_filters.push({
          field: key,
          matchMode: FilterMatchMode.DATE_AFTER,
          value: df[0],
        });
      df[1] &&
        tmp_filters.push({
          field: key,
          matchMode: FilterMatchMode.DATE_BEFORE,
          value: df[1],
        });
    });
    return tmp_filters as any[];
  } catch (_e: any) {
    return [];
  }
}

const refresh = (): void => {
  const tmp_filters = buildFilters();
  emit("filtersChange", filtersToExport, dateFilters.value);
  console.log(tmp_filters);
  getAllTotalCount(tmp_filters, pagination, sortOrder.value as Sorter[]);
};

let exportCallBack: () => void;

const dataToExcel = async (
  totalCount: number,
  current_filters: Filter<any>[],
) => {
  loading.value = true;
  let i = 0;
  const workBook = new ExcelJS.Workbook();
  const workSheet = workBook.addWorksheet("export");
  workSheet.columns = columns
    .filter((col) => !col.noExportable)
    .map((col) => {
      return { header: col.header, key: col.field };
    });
  for (i = 0; i < totalCount / 1000; i += 1) {
    const data = await dataService.getAll(
      current_filters,
      new Pagination(i, 1000),
      sortOrder.value as any,
    );

    const exportData = data.map((item) => {
      return columns.reduce((obj: any, key: ColumnData) => {
        if (item[key.field] != undefined && !key.noExportable) {
          obj[key.field] = applyTransformation(key, item);
        }
        return obj;
      }, {});
    });

    exportData.forEach((row) => {
      workSheet.addRow(row);
    });
  }

  if (totalCount > 1000 && totalCount % 1000 != 0) {
    const data_tmp = await dataService.getAll(
      current_filters,
      new Pagination(i, 1000 - (totalCount % 1000)),
      sortOrder.value as any,
    );
    const exportData = data_tmp.map((item) => {
      return columns.reduce((obj: any, key: ColumnData) => {
        if (item[key.field] != undefined && !key.noExportable) {
          obj[key.field] = applyTransformation(key, item);
        }
        return obj;
      }, {});
    });
    exportData.forEach((row) => {
      workSheet.addRow(Object.values(row));
    });
  }

  const buffer = await workBook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `table_data.xlsx`);

  loading.value = true;
};

const exportCSV = async () => {
  loading.value = true;
  const current_filters = buildFilters();
  const { totalCount } = await dataService.getCount(current_filters);
  loading.value = false;
  loading.value = true;

  if (totalCount <= 10000) {
    if (totalCount > 5000) {
      advice_visible.value = true;
      exportCallBack = () => {
        dataToExcel(totalCount, current_filters);
        advice_visible.value = false;
      };
    } else {
      await dataToExcel(totalCount, current_filters);
    }
  } else {
    negation_visible.value = true;
  }
  loading.value = false;
};

onMounted(() => {
  columns.forEach((col) => {
    /* ocultar filter options en las columnas de fechas */
    if (col.dataType === "date") {
      col.showFilterOptions = false;
    }
  });

  products.value = new Array(size.value);
  refresh();
});

defineExpose({
  refresh,
  filters,
  dateFilters,
  loadFilters,
});

const initFilters = () => {
  const aux: any = {};
  const globFilters = [] as string[];
  filtersToExport = {};

  for (let column of columns) {
    globFilters.push(column.filter_field ?? column.field);
    if (column && column.filter) {
      if (column.dataType === "date") {
        (dateFilters.value[column.filter_field ?? column.field] as any) = [
          null,
          null,
        ];
      } else {
        aux[column.filter_field ?? column.field] = column.filter;

        (filtersToExport as any)[column.filter_field ?? column.field] = {
          matchMode: column.filter?.matchMode ?? null,
          filterQuery: column.filter?.filterQuery ?? null,
          value: null,
        };
      }
    }
  }
  globalFilters.value = globFilters;
  filters.value = aux;
};
const clearFilter = () => {
  initFilters();
  dataService.filters = filters.value;
  refresh();
};
const restartPagination = () => {
  pagination.page = 0;
};

initFilters();

if (dataService.orders != null) {
  sortOrder.value = dataService.orders;
}

if (dataService.filters != null) {
  loadFiltersToExport();
  filters.value = dataService.filters;
}
</script>

<style scoped>
:deep .p-datatable-loading-overlay {
  background: transparent;
}
</style>
