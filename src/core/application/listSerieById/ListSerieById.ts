import type { Repository } from './../../domain/Repository'
import { SYMBOLS_SERIES } from './../../infrastructure/Types'
import { inject, injectable } from 'inversify'

@injectable()
export class ListSerieById {
  constructor(
    @inject(SYMBOLS_SERIES.SERIE_REPOSITORY)
    private readonly repository: Repository
  ) {}
  execute(serieId: string) {
    return this.repository.getSerieById(serieId)
  }
}
