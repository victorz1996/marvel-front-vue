import type { Repository } from '../../domain/Repository'
import { SYMBOLS_SERIES } from '../../infrastructure/Types'
import { inject, injectable } from 'inversify'

@injectable()
export class ListResources {
  constructor(
    @inject(SYMBOLS_SERIES.SERIE_REPOSITORY)
    private readonly repository: Repository
  ) {}
  execute(serieId: string, resourceName: string) {
    return this.repository.getResourcesBySerieIdAndResourceName(serieId, resourceName)
  }
}
