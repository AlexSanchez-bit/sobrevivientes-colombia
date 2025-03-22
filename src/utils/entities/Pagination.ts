export class Pagination {
  page: number = 1
  ammount: number = 5
  after: number = 0

  constructor (page: number =5, ammount: number=5, after: number=0) {
    this.page = page
    this.ammount = ammount
    this.after = after
  }
}
