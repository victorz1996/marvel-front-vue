<script lang="ts">
import { ref, type Ref } from 'vue'
import CardSeries from '@/components/CardSeries.vue'
import { mapActions, mapState } from 'pinia'
import { useGlobalStore } from '../stores/store'
import LoaderComponent from '@/components/LoaderComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import type { Serie } from '@/core/domain/Serie'
import { container } from '@/core/infrastructure/Container'
import type { ListSeries } from '@/core/application/listSeries/ListSeries'
import { SYMBOLS_SERIES } from '@/core/infrastructure/Types'
import type { ResponseEntity } from '@/core/domain/ResponseEntity'

export default {
  components: {
    CardSeries,
    LoaderComponent,
    ErrorComponent
  },
  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  computed: {
    ...mapState(useGlobalStore, ['getViewSeries'])
  },
  setup() {
    const series: Ref<Serie[]> = ref([])
    const seriesLimit: Ref<number> = ref(0)
    const seriesSize: Ref<number> = ref(20)
    const currentPage: Ref<number> = ref(0)
    const isLoading: Ref<boolean> = ref(false)
    const isError: Ref<boolean> = ref(false)
    const isNoData: Ref<boolean> = ref(false)
    return {
      series,
      seriesLimit,
      seriesSize,
      currentPage,
      isLoading,
      isError,
      isNoData
    }
  },

  async mounted() {
    await this.getSeriesWithPagination(this.currentPage, this.seriesSize)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    ...mapActions(useGlobalStore, ['addViewSerie']),
    async getSeriesWithPagination(currentPage: number, size: number): Promise<void> {
      this.isLoading = true
      const response: ResponseEntity = await container
        .get<ListSeries>(SYMBOLS_SERIES.LIST_SERIES)
        .execute(size.toString(), currentPage.toString())
      if (response.code === 200 && response.data.length) {
        this.series = this.series.concat(response.data)
      } else {
        this.series = []
        this.isError = true
      }
      this.isLoading = false
    },
    getResourcesRelatedNumber(data: Serie): string {
      let stringToReturn = ''
      if (data.characters?.available) {
        stringToReturn = stringToReturn + `${data.characters?.available} Characters, `
      }
      if (data.creators?.available) {
        stringToReturn = stringToReturn + `${data.creators?.available} Creators, `
      }
      if (data.events?.available) {
        stringToReturn = stringToReturn + `${data.events?.available} Events, `
      }
      if (data.stories?.available) {
        stringToReturn = stringToReturn + `${data.stories?.available} Stories, `
      }
      if (data.comics?.available) {
        stringToReturn = stringToReturn + `${data.comics?.available} Comics`
      }
      return stringToReturn
    },
    handleScroll(): void {
      const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight
      if (endOfPage && !this.isLoading) {
        this.currentPage = this.currentPage + 1
        this.getSeriesWithPagination(this.currentPage, this.seriesSize)
      }
    },
    goToDetail(serie: Serie) {
      const findSerie = this.getViewSeries.find((saveSerie) => saveSerie.id === serie.id)
      if (!findSerie) {
        this.addViewSerie(serie)
      }
      this.$router.push(`/detail/${serie.id}`)
    }
  }
}
</script>

<template>
  <h1 v-if="!isLoading" style="text-align: center">Home View</h1>
  <div class="row">
    <div v-for="serie in series" :key="serie.id" class="column" style="">
      <CardSeries
        :title="serie.title"
        :type="serie.type"
        :ages="serie.endYear - serie.startYear"
        :img="`${serie.thumbnail?.path}.${serie.thumbnail?.extension}`"
        :resourcesRelatedNumber="getResourcesRelatedNumber(serie)"
        @click="goToDetail(serie)"
        style="cursor: pointer"
      ></CardSeries>
    </div>
  </div>
  <div v-if="isLoading">
    <LoaderComponent></LoaderComponent>
  </div>
  <ErrorComponent
    v-if="isError"
    type="Danger"
    message="Ups! Have one error with the call service, reload the app"
  ></ErrorComponent>
  <ErrorComponent v-if="isNoData" type="Alert" message="Info! Dont have data"></ErrorComponent>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

.column {
  min-height: 55vh;
  width: calc((100% / 3) - 16px);
  margin: 8px;
  transition: all 200ms ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}
.row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.row:after {
  content: '';
  display: table;
  clear: both;
}

@media screen and (max-width: 700px) {
  .column {
    width: 100%;
  }
}
</style>
