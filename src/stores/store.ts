import type { Serie } from '@/core/domain/Serie'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('globalStore', {
  state: () => {
    return {
      viewSeries: [] as Serie[],
      savedSeries: [] as Serie[]
    }
  },
  getters: {
    getViewSeries(state): Serie[] {
      return state.viewSeries
    },
    getSavedSeries(state): Serie[] {
      return state.savedSeries
    }
  },
  actions: {
    addViewSerie(serie: Serie) {
      this.viewSeries.push(serie)
    },
    addSavedSerie(serie: Serie) {
      this.savedSeries.push(serie)
    },
    removeSavedSerie(serieId: string) {
      const findSerie = this.savedSeries.find((serie) => serie.id === serieId)
      if (!findSerie) {
        return
      }
      const index = this.savedSeries.indexOf(findSerie)
      if (index > -1) this.savedSeries.splice(index, 1)
    }
  }
})
