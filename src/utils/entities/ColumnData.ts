export class ColumnData<ValueType = any> {
  field!: string;
  header?: string;
  filter?: FiltersDefinition | null = null;
  sorteable?: boolean = false;
  showFilterOptions?: boolean = true;
  dataType?: string | null;
  filter_field?: string;
  noExportable?: boolean;
  exportTransformation?: (value: ValueType) => string;
}
export function applyTransformation<ValueType = any>(
  column: ColumnData<ValueType>,
  data: ValueType, //todo el objeto a exportar y cada columna define como sacar su informacion de ahi
) {
  if (column.exportTransformation) {
    return column.exportTransformation(data);
  } else {
    return (data as any)[column.field].toString();
  }
}

export class FiltersDefinition {
  value: any;
  matchMode?: string;
  filterQuery?: string;
}
