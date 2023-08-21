<script lang="ts">
import { type Ref, ref } from 'vue'
import TabComponent from '../components/TabComponent.vue'
import ToggleComponent from '../components/ToggleComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import { mapActions, mapState } from 'pinia'
import { useGlobalStore } from '../stores/store'
import LoaderComponent from '@/components/LoaderComponent.vue'
import type { Serie } from '@/core/domain/Serie'
import type { ResponseEntity } from '@/core/domain/ResponseEntity'
import { container } from '@/core/infrastructure/Container'
import { SYMBOLS_SERIES } from '@/core/infrastructure/Types'
import type { ListResources } from '@/core/application/listResources/ListResources'
import type { ListSerieById } from '@/core/application/listSerieById/ListSerieById'
import type { MessageAlert } from '@/core/domain/MessageAlert'
const newSerie: Serie = {
  id: '',
  endYear: 0,
  modified: '',
  rating: '',
  startYear: 0,
  title: '',
  type: '',
  characters: null,
  comics: null,
  creators: null,
  events: null,
  stories: null,
  thumbnail: {
    path: '',
    extension: ''
  },
  urls: null,
  isSaved: null
}
export default {
  components: {
    TabComponent,
    ToggleComponent,
    ErrorComponent,
    LoaderComponent
  },

  computed: {
    ...mapState(useGlobalStore, ['getSavedSeries'])
  },
  setup() {
    const serie: Ref<Serie> = ref(newSerie)
    const detailResourcesList: Ref<any[]> = ref([])
    const isLoading: Ref<boolean> = ref(false)
    const isError: Ref<boolean> = ref(false)
    const isLoadingResources: Ref<boolean> = ref(false)
    const isErrorResources: Ref<boolean> = ref(false)
    const actionMessageExecuter: Ref<boolean> = ref(false)
    const objectMessageAction: Ref<MessageAlert> = ref({ type: '', message: '' })
    const activeResource: Ref<string> = ref('')

    return {
      serie,
      detailResourcesList,
      isLoading,
      isError,
      isLoadingResources,
      isErrorResources,
      actionMessageExecuter,
      objectMessageAction,
      activeResource
    }
  },
  async mounted() {
    await this.getSerieByid(this.$route.params.id as string)
  },

  methods: {
    ...mapActions(useGlobalStore, ['addSavedSerie', 'removeSavedSerie']),
    async getSerieByid(idSerie: string): Promise<void> {
      this.isLoading = true
      const response: ResponseEntity = await container
        .get<ListSerieById>(SYMBOLS_SERIES.LIST_SERIE_BY_ID)
        .execute(idSerie)
      if (response.code === 200) {
        const result = response.data
        this.serie = {
          ...result,
          isSaved: this.getIsSaveSerie(result.id)
        }
      } else {
        this.serie = newSerie
        this.isError = true
      }
      this.isLoading = false
    },
    getIsSaveSerie(serieId: string) {
      if (this.getSavedSeries.length) {
        return this.getSavedSeries.some((serie) => serie.id === serieId)
      }
      return false
    },
    buildDataToTabs(serie: Serie): any[] {
      let arrayToReturn = []
      if (serie.characters?.available) {
        arrayToReturn.push({ ...serie.characters, name: 'Characters' })
      }
      if (serie.comics?.available) {
        arrayToReturn.push({ ...serie.comics, name: 'Comics' })
      }
      if (serie.creators?.available) {
        arrayToReturn.push({ ...serie.creators, name: 'Creators' })
      }
      if (serie.events?.available) {
        arrayToReturn.push({ ...serie.events, name: 'Events' })
      }
      if (serie.stories?.available) {
        arrayToReturn.push({ ...serie.stories, name: 'Stories' })
      }
      return arrayToReturn
    },
    async getResourcesBySerieIdAndResourceName(
      serieId: string,
      resourceName: string
    ): Promise<void> {
      this.isLoadingResources = true
      this.activeResource = resourceName
      const response: ResponseEntity = await container
        .get<ListResources>(SYMBOLS_SERIES.LIST_RESOURCES_BY_SERIE_ID_AND_RESOURCE_NAME)
        .execute(serieId, resourceName)
      if (response.code === 200 && response.data.length) {
        this.detailResourcesList = response.data
      } else {
        this.detailResourcesList = []
        this.isErrorResources = true
      }
      this.isLoadingResources = false
    },
    saveSerie(event: boolean) {
      if (event) {
        if (this.getSavedSeries.length < 10) {
          this.addSavedSerie(this.serie)
          this.showActionMessage(
            'Success',
            'the Item was saved succesfully, go to the saved item into history view'
          )
        } else {
          this.serie.isSaved = null
          setTimeout(() => {
            this.serie.isSaved = false
          }, 0)
          this.showActionMessage('Alert', 'You most the most saved items(10)')
        }
      } else this.removeSavedSerie(this.serie.id)
    },
    showActionMessage(type: string, message: string): void {
      this.actionMessageExecuter = true
      this.objectMessageAction = {
        type,
        message
      }
      setTimeout(() => {
        this.actionMessageExecuter = false
      }, 2000)
    }
  }
}
</script>
<template>
  <ErrorComponent
    v-if="actionMessageExecuter"
    :type="objectMessageAction.type"
    :message="objectMessageAction.message"
  ></ErrorComponent>
  <h1 v-if="!isLoading" style="text-align: center">Detail View</h1>
  <div v-if="serie" class="detail-container">
    <div class="detail-top">
      <img height="300" :src="`${serie.thumbnail.path}.${serie.thumbnail.extension}`" alt="" />
      <div style="margin-left: 5rem; flex-basis: 100%">
        <h4>Title: {{ serie.title }}</h4>
        <p>Description: {{ serie.description || 'n/a' }}</p>
        <p>Type: {{ serie.type || 'n/a' }}</p>
        <p>Start year: {{ serie.startYear || 'n/a' }}</p>
        <p>End year: {{ serie.endYear || 'n/a' }}</p>
        <p>Rating: {{ serie.rating || 'n/a' }}</p>
        <p>Modified: {{ serie.modified || 'n/a' }}</p>
      </div>
      <div style="margin-top: 1rem; margin-right: 1rem">
        <h3>Saved</h3>
        <ToggleComponent
          v-if="serie.isSaved !== null"
          @changeValue="saveSerie"
          :active-value="serie.isSaved"
        ></ToggleComponent>
      </div>
    </div>
    <div style="margin-top: 1rem">
      <TabComponent
        v-if="buildDataToTabs(serie).length"
        @changeTab="getResourcesBySerieIdAndResourceName(serie.id, $event)"
        :data-to-tabs="buildDataToTabs(serie)"
      >
        <div v-if="!isLoadingResources">
          <div
            style="display: flex; margin-top: 1rem"
            v-for="resource of detailResourcesList"
            :key="resource.id"
          >
            <img
              v-if="resource.thumbnail"
              width="200"
              height="200"
              style="min-width: 200px"
              :src="resource.thumbnail?.path + '.' + resource.thumbnail?.extension"
              alt=""
            />
            <div style="margin-left: 4rem">
              <h4 v-if="resource.fullName || resource.name">
                Name: {{ resource.fullName || resource.name }}
              </h4>
              <h4 v-if="resource.title">Title: {{ resource.title }}</h4>
              <p>Modified: {{ resource.modified }}</p>
              <p v-if="resource.textObjects?.length">
                Description: {{ resource.textObjects[0].text }}
              </p>
              <p v-if="activeResource === 'Stories'">Type: {{ resource.type }}</p>
            </div>
          </div>
        </div>
        <LoaderComponent v-if="isLoadingResources"></LoaderComponent>
        <ErrorComponent
          v-if="isErrorResources && !isLoadingResources"
          type="Danger"
          message="Api Failed"
        ></ErrorComponent>
      </TabComponent>
      <div v-else>
        <ErrorComponent type="Alert" message="No have resources"></ErrorComponent>
      </div>
    </div>
  </div>
  <div v-if="isLoading">
    <LoaderComponent></LoaderComponent>
  </div>
  <ErrorComponent
    style="margin-top: 3rem"
    v-if="isError && !isLoading"
    type="Danger"
    message="Have Error, reolad page"
  ></ErrorComponent>
</template>

<style scoped lang="scss">
.detail-container {
  margin-top: 3rem;
  .detail-top {
    display: flex;
  }
}
</style>
