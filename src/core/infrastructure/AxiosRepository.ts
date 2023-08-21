import { injectable } from 'inversify'
import axios from 'axios'
import type { Repository } from '../domain/Repository'
import type { ResponseEntity } from '../domain/ResponseEntity'

@injectable()
export class AxiosRepository implements Repository {
  baseUrlApi = import.meta.env.VITE_API_BASE_URL
  apiKey = import.meta.env.VITE_MARVEL_API_KEY

  async getSeries(size: string, currentPage: string): Promise<ResponseEntity> {
    try {
      const res: any = await axios.get(
        `${this.baseUrlApi}/series?limit=${size}&offset=${currentPage}&apikey=${this.apiKey}`
      )
      return {
        data: res.data.data.results,
        code: res.data.code
      }
    } catch (error: any) {
      return {
        data: [],
        code: error.response.status
      }
    }
  }
  async getSerieById(serieId: string): Promise<ResponseEntity> {
    try {
      const res: any = await axios.get(`${this.baseUrlApi}/series/${serieId}?apikey=${this.apiKey}`)
      return {
        data: res.data.data.results[0],
        code: res.data.code
      }
    } catch (error: any) {
      return {
        data: null,
        code: error.response.status
      }
    }
  }

  async getResourcesBySerieIdAndResourceName(
    serieId: string,
    resourceName: string
  ): Promise<ResponseEntity> {
    try {
      const res: any = await axios.get(
        `${this.baseUrlApi}/series/${serieId}/${resourceName.toLowerCase()}?apikey=${this.apiKey}`
      )
      return {
        data: res.data.data.results,
        code: res.data.code
      }
    } catch (error: any) {
      return {
        data: [],
        code: error.response.status
      }
    }
  }
}
