<script lang="ts">
import { ref, type Ref } from 'vue'
import CardSeries from '../components/CardSeries.vue'
import { mapActions } from 'pinia'
import { useGlobalStore } from '../stores/store'

export default {
  components: {
    CardSeries
  },
  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  setup() {
    const series: Ref<any[]> = ref([])
    const seriesLimit: Ref<number> = ref(0)
    const seriesSize: Ref<number> = ref(20)
    const currentPage: Ref<number> = ref(0)
    const isLoading: Ref<boolean> = ref(false)
    return {
      series,
      seriesLimit,
      seriesSize,
      currentPage,
      isLoading
    }
  },

  mounted() {
    this.getSeriesWithPagination(this.currentPage, this.seriesSize)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    ...mapActions(useGlobalStore, ['addViewSerie']),
    getSeriesWithPagination(currentPage: number, size: number): void {
      this.isLoading = true
      fetch(
        `https://gateway.marvel.com:443/v1/public/series?limit=${size}&offset=${currentPage}&apikey=e6a1258526d5fac0f4db3be7ad946698`
      )
        .then((response) => response.json())
        .then((data) => {
          const responseFormated = data.data.results.map((result: any) => {
            return {
              id: result.id,
              title: result.title,
              type: result.type,
              ages: result.endYear - result.startYear,
              img: `${result.thumbnail.path}.${result.thumbnail.extension}`,
              resourcesRelatedNumber: this.getResourcesRelatedNumber(result)
            }
          })
          this.series = this.series.concat(responseFormated)
          this.isLoading = false
        })
    },
    getResourcesRelatedNumber(data: any): string {
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
    goToDetail(serie: any) {
      this.addViewSerie(serie)
      this.$router.push(`/detail/${serie.id}`)
    }
  }
}
</script>

<template>
  <div class="row">
    <div v-for="serie in series" :key="serie.id" class="column" style="">
      <CardSeries
        :title="serie.title"
        :type="serie.type"
        :ages="serie.ages"
        :img="serie.img"
        :resourcesRelatedNumber="serie.resourcesRelatedNumber"
        @click="goToDetail(serie)"
        style="cursor: pointer"
      ></CardSeries>
    </div>
  </div>
  <div v-if="isLoading">Cargando...</div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

/* Create four equal columns that floats next to each other */
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
}

/* Clear floats after the columns */
.row:after {
  content: '';
  display: table;
  clear: both;
}

/* Responsive layout - makes the four columns stack on top of each other instead of next to each other */
@media screen and (max-width: 700px) {
  .column {
    width: 100%;
  }
}
</style>
