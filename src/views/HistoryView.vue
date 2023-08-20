<script lang="ts">
import { mapState } from 'pinia'
import { useGlobalStore } from '../stores/store'

export default {
  computed: {
    ...mapState(useGlobalStore, ['getViewSeries'])
  },
  mounted() {
    console.log(this.getViewSeries, 'desde pinia')
  }
}
</script>
<template>
  <div class="tabs">
      <TabComponent
        v-if="buildDataToTabs(serie).length"
        @changeTab="getResourcesBySerieIdAndResourceName(serie.id, $event)"
        :data-to-tabs="buildDataToTabs(serie)"
      >
        <div>
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
        </div></TabComponent
      >
      <div v-else>Not found resources</div>
</template>

<style></style>
