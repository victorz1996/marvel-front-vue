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
  <div class="about">
    <h1>This is an history page</h1>
  </div>
</template>

<style></style>
