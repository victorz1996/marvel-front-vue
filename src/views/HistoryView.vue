<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { useGlobalStore } from '../stores/store'
import TabComponent from '../components/TabComponent.vue'
import ToggleComponent from '../components/ToggleComponent.vue'
import { type Ref, ref } from 'vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import type { Serie } from '@/core/domain/Serie'
import type { MessageAlert } from '@/core/domain/MessageAlert'

interface Tab {
  id: number
  name: string
}

export default {
  setup() {
    const actionMessageExecuter: Ref<boolean> = ref(false)
    const objectMessageAction: Ref<MessageAlert> = ref({ type: '', message: '' })
    const activeResource: Ref<string> = ref('')
    const tabs: Ref<Tab[]> = ref([
      { id: 1, name: 'Viewed' },
      { id: 2, name: 'Saved' }
    ])
    const activeList: Ref<Serie[]> = ref([])
    return {
      actionMessageExecuter,
      objectMessageAction,
      activeResource,
      tabs,
      activeList
    }
  },
  components: {
    TabComponent,
    ToggleComponent,
    ErrorComponent
  },
  computed: {
    ...mapState(useGlobalStore, ['getViewSeries', 'getSavedSeries'])
  },
  mounted() {},
  methods: {
    ...mapActions(useGlobalStore, ['addSavedSerie', 'removeSavedSerie']),
    getResourcesSeriesToShow(activeTab: string) {
      this.activeResource = activeTab
      if (activeTab === 'Viewed') {
        this.activeList = this.getViewSeries.filter(
          (viewSerie) => !this.getSavedSeries.some((savedSerie) => savedSerie.id === viewSerie.id)
        )
        return
      }
      this.activeList = this.getSavedSeries
    },
    gotToDetail(serie: Serie) {
      if (this.activeResource !== 'Viewed') return
      this.$router.push(`/detail/${serie.id}`)
    },
    saveSerie(event: boolean, serie: Serie) {
      if (event) {
        if (this.getSavedSeries.length < 10) {
          this.addSavedSerie(serie)
          this.showActionMessage(
            'Success',
            'the Item was saved succesfully, go to the saved item into history view'
          )
        } else {
          serie.isSaved = null
          setTimeout(() => {
            serie.isSaved = false
          }, 0)
          this.showActionMessage('Alert', 'Yuo most the most saved items(10)')
        }
        this.getResourcesSeriesToShow(this.activeResource)
      }
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
  <h1 style="text-align: center">History View</h1>
  <div style="margin-top: 3rem">
    <TabComponent @changeTab="getResourcesSeriesToShow" :data-to-tabs="tabs">
      <div>
        <div
          style="display: flex; margin-top: 1rem"
          v-for="resource of activeList"
          :key="resource.id"
        >
          <div
            @click="gotToDetail(resource)"
            style="display: flex; flex-basis: 100%"
            :style="{ cursor: activeResource === 'Viewed' ? 'pointer' : '' }"
          >
            <img
              v-if="resource.thumbnail"
              width="150"
              height="150"
              style="min-width: 200px"
              :src="resource.thumbnail?.path + '.' + resource.thumbnail?.extension"
              alt=""
            />
            <div style="margin-left: 4rem">
              <h4 v-if="resource.title">Title: {{ resource.title }}</h4>
              <p>Modified: {{ resource.modified }}</p>
              <p>Ages: {{ resource.endYear - resource.startYear }}</p>
            </div>
          </div>
          <div v-if="activeResource === 'Viewed'" style="margin-top: 1rem; margin-right: 1rem">
            <h3>Saved</h3>
            <ToggleComponent
              v-if="resource.isSaved !== null"
              @changeValue="saveSerie($event, resource)"
              :active-value="resource.isSaved"
            ></ToggleComponent>
          </div>
        </div>
        <ErrorComponent
          v-if="!activeList.length"
          type="Info"
          :message="
            activeResource === 'Viewed' ? 'You dont see any item' : 'You dont save any item'
          "
        ></ErrorComponent>
      </div>
    </TabComponent>
  </div>
</template>

<style></style>
