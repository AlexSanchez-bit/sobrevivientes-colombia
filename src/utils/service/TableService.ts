import { Filter } from "../entities/Filter";
import { Pagination } from "../entities/Pagination";
import { useToastStorage } from "@/stores/ToasterStorage";
import { supabase } from "@/setup";
import { Sorter } from "../entities/Sorters";
import { FilterMatchMode } from "primevue/api";
import moment from "moment-timezone";

export abstract class TableService<T> {
  public data!: T[];
  public totalCount: number = 0;
  protected tablename: string;
  protected search_fields: string[];
  protected readonly notify;
  private readonly user_id: string;
  private _filters: any | null = null;
  private _pagination: any | null = null;
  private _orders: any | null = null;

  public get filters() {
    if (this._filters == null) {
      try {
        return JSON.parse(
          localStorage.getItem(this.user_id + this.tablename + "filter")!,
        );
      } catch (e) {
        return null;
      }
    }
    return this._filters;
  }

  public set filters(value: any) {
    this._filters = value;
    localStorage.setItem(
      this.user_id + this.tablename + "filter",
      JSON.stringify(value),
    );
  }

  public get pagination() {
    return this._pagination;
  }

  private set pagination(value: any) {
    this._pagination = value;
    localStorage.setItem(
      this.user_id + this.tablename + "pagination",
      JSON.stringify(value),
    );
  }

  public get orders() {
    if (this._orders == null) {
      try {
        return JSON.parse(
          localStorage.getItem(this.user_id + this.tablename + "orders")!,
        );
      } catch (e) {
        return null;
      }
    }
    return this._orders;
  }

  private set orders(value: any) {
    this._orders = value;
    localStorage.setItem(
      this.user_id + this.tablename + "orders",
      JSON.stringify(value),
    );
  }

  constructor(tablename: string, searchFields: string[]) {
    this.notify = useToastStorage();
    this.tablename = tablename;
    this.search_fields = searchFields;
    this.user_id = "jj";
  }
  get builder() {
    return supabase.from(this.tablename);
  }

  public buildSelect() {
    return this.builder.select(this.search_fields.join(" , "), {
      count: "exact",
    });
  }

  public async getAll(
    filters: Filter<any>[],
    pagination: Pagination,
    orders: Sorter[] | null,
  ): Promise<any[]> {
    let query = this.buildSelect();
    query = this.applyFilters(query, filters);
    if (orders != null) {
      for (let sortOrder of orders) {
        query = query.order(sortOrder.field, {
          ascending: sortOrder.order > 0,
        });
      }
    }

    query = query.range(
      pagination.page * pagination.ammount,
      pagination.page * pagination.ammount + pagination.ammount - 1,
    );

    let { data, error } = await query;

    if (error) {
      this.notify.notify("error", "Ocurrio un error", error.message, 4000);
      const keys: any = {} as any;
      for (let field in this.search_fields) {
        keys[field] = null as any;
      }

      data = [keys];
      return [];
    }
    return data as any[];
  }

  public async getAllTotalCount(
    filters: Filter<any>[],
    pagination: Pagination,
    orders: Sorter[] | null,
  ): Promise<{ data: any[]; totalCount: number }> {
    if (
      this.pagination == null ||
      pagination.ammount != this.pagination.ammount ||
      pagination.page != this.pagination.page
    ) {
      this.pagination = pagination;
    }

    if (orders !== this.orders) {
      this.orders = orders;
    }
    let query = this.buildSelect();
    query = this.applyFilters(query, filters);
    if (orders != null) {
      for (let sortOrder of orders) {
        query = query.order(sortOrder.field, {
          ascending: sortOrder.order > 0,
        });
      }
    }

    query = query
      .range(
        pagination.page * pagination.ammount,
        pagination.page * pagination.ammount + pagination.ammount - 1,
      )
      .order("created_at", { ascending: false });

    let { data, count, error } = await query;

    if (error) {
      this.notify.notify("error", "Ocurrio un error", error.message, 4000);
      const keys: any = {} as any;
      for (let field in this.search_fields) {
        keys[field] = null as any;
      }

      data = [keys];
      return { totalCount: 0, data };
    }
    return { totalCount: count, data: data as any[] };
  }

  public async getCount(
    filters: Filter<any>[],
  ): Promise<{ totalCount: number }> {
    let query = this.buildSelect();

    query = this.applyFilters(query, filters);

    let { count, error } = await query;

    if (error) {
      this.notify.notify("error", "Ocurrio un error", error.message, 5000);
      return { totalCount: 0 };
    }

    return { totalCount: count };
  }

  private applyFilters(query: any, filters: Filter<any>[]) {
    for (let filter of filters) {
      if (filter.matchMode == "IS") {
        query = query.is(
          filter.field,
          filter.value == "null" ? null : filter.value,
        );
      }
      if (filter.value != null) {
        let field = filter.field;
        switch (filter.matchMode) {
          case "OR":
            query = query.or(filter.value);
            break;
          case "AND":
            for (let [field, op, value] of filter.value) {
              query = query.filter(field, op, value);
            }

            break;
          case FilterMatchMode.EQUALS:
            query = query.eq(field, filter.value);
            break;

          case FilterMatchMode.IN:
            query = query.in(field, filter.value);
            break;
          case "NOT_IN":
            query = query.not(field, "in", `(${filter.value.join(",")})`);
            break;
          case FilterMatchMode.CONTAINS:
            query = query.ilike(field, `%${filter.value}%`);
            break;
          case FilterMatchMode.STARTS_WITH:
            query = query.ilike(field, `${filter.value}%`);
            break;
          case FilterMatchMode.NOT_CONTAINS:
            query = query.not(field, "ilike", `%${filter.value}%`);
            break;
          case FilterMatchMode.ENDS_WITH:
            query = query.ilike(field, `%${filter.value}`);
            break;
          case FilterMatchMode.NOT_EQUALS:
            query = query.not(field, "eq", filter.value);
            break;
          case FilterMatchMode.GREATER_THAN:
            query = query.gt(field, parseInt(filter.value));
            break;
          case FilterMatchMode.LESS_THAN:
            query = query.lt(field, parseInt(filter.value));
            break;
          case FilterMatchMode.GREATER_THAN_OR_EQUAL_TO:
            query = query.gte(field, parseInt(filter.value));
            break;
          case FilterMatchMode.LESS_THAN_OR_EQUAL_TO:
            query = query.lte(field, parseInt(filter.value));
            break;
          case FilterMatchMode.DATE_IS:
            const truncatedDate = new Date(filter.value)
              .toISOString()
              .split("T")[0];
            const startDate = new Date(truncatedDate);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);

            // Convertir las fechas a ISO string
            const startDateISOString = startDate.toISOString();
            const endDateISOString = endDate.toISOString();
            query = query
              .gte(field, startDateISOString)
              .lt(field, endDateISOString);
            break;
          case FilterMatchMode.DATE_IS_NOT:
            query = query.not(
              field,
              "eq",
              new Date(filter.value).toISOString(),
            );
            break;
          case FilterMatchMode.DATE_AFTER:
            // const date_after = new Date(filter.value);
            const filter_after = moment
              .tz(filter.value, "America/Havana")
              .startOf("day")
              .utc();
            const formatted_after = filter_after.format(
              "YYYY-MM-DD HH:mm:ss[+00:00]",
            );
            query = query.gte(field, formatted_after);
            break;
          case FilterMatchMode.DATE_BEFORE:
            const date_before = moment
              .tz(filter.value, "America/Havana")
              .endOf("day")
              .utc();
            const formatted_before = date_before.format(
              "YYYY-MM-DD HH:mm:ss[+00:00]",
            );
            query = query.lte(field, formatted_before);
            break;
        }
      }
    }
    return query;
  }
}
