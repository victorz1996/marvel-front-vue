<script lang="ts">
import type { PropType } from 'vue'

export default {
  emits: ['changeTab'],
  props: {
    dataToTabs: Array as PropType<any[]>
  },
  mounted() {
    if (this.dataToTabs?.length) {
      const tabContentElementInit = document.getElementById(this.dataToTabs[0].name)
      if (tabContentElementInit) {
        tabContentElementInit.style.display = 'block'
        this.$emit('changeTab', this.dataToTabs[0].name)
      }
    }
  },
  methods: {
    openCity(evt: any, tabName: any) {
      // Declare all variables
      let i, tabcontent: any, tablinks

      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName('tabcontent')
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none'
      }

      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName('tablinks')
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '')
      }

      // Show the current tab, and add an "active" class to the button that opened the tab
      const tabContentElement = document.getElementById(tabName)
      if (tabContentElement) {
        tabContentElement.style.display = 'block'
        evt.currentTarget.className += ' active'
      }
      this.$emit('changeTab', tabName)
    }
  }
}
</script>
<template>
  <div class="tab">
    <button
      v-for="(tabItem, index) of dataToTabs"
      :key="index"
      class="tablinks"
      @click="openCity($event, tabItem.name)"
    >
      {{ tabItem.name }}
    </button>
  </div>

  <!-- Tab content -->
  <div
    v-for="(tabItemContent, index) of dataToTabs"
    :key="index"
    :id="tabItemContent.name"
    class="tabcontent"
  >
    <slot></slot>
  </div>
</template>
<style scoped lang="scss">
.tab {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}

/* Style the buttons that are used to open the tab content */
.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
}

/* Change background color of buttons on hover */
.tab button:hover {
  background-color: #ddd;
}

/* Create an active/current tablink class */
.tab button.active {
  background-color: #ccc;
}

/* Style the tab content */
.tabcontent {
  display: none;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-top: none;
}
</style>
