import type { ResponseEntity } from './ResponseEntity'

export interface Repository {
  getSeries(size: string, currentPage: string): Promise<ResponseEntity>
  getSerieById(serieId: string): Promise<ResponseEntity>
  getResourcesBySerieIdAndResourceName(serieId: string, resourceName: string): Promise<ResponseEntity>
}
