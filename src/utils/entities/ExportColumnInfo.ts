export class ExportColumnInfo<ValueType = any> {
  field!: string;
  header!: string;
  transformation: (value: ValueType) => string = (value: ValueType) => {
    return (value as any).toString();
  };
}
