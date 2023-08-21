import type { Repository } from './../../domain/Repository';
import { SYMBOLS_SERIES } from './../../infrastructure/Types';
import { inject, injectable } from 'inversify'

@injectable()
export class ListSeries {
  constructor(
    @inject(SYMBOLS_SERIES.SERIE_REPOSITORY)
    private readonly repository: Repository
  ) {}
  execute(size:string, currentPage:string){
    return this.repository.getSeries(size, currentPage)
  }
}
