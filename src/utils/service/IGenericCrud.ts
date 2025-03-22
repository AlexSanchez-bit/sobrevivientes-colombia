export interface IGenericCreate<T, R> {
  create(data: T): Promise<R>;
}
export interface IGenericUpdate<T, R> {
  update(id: string | number, data: T): Promise<R>;
}
export interface IGenericList<DR> {
  getDetails(id: string | number): Promise<DR>;
}
export interface IGenericRemove<DR> {
  remove(id: string | number): Promise<DR>;
}

export interface IGenericCrud<T, CT, UT, CR, ER, Rr, DR>
  extends IGenericCreate<CT, CR>,
    IGenericList<DR>,
    IGenericUpdate<UT, ER>,
    IGenericRemove<Rr> {}
