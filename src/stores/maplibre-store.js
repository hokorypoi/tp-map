import { defineStore, acceptHMRUpdate } from 'pinia'

export const useMaplibreStore = defineStore('maplibre', {
  state: () => ({
    // counter: 0,
    listPanelOpen: false,
    featureInfoBoxState: { open: false, id: undefined },
    basemapPanelOpen: false,
  }),

  getters: {
    // doubleCount: (state) => state.counter * 2,
  },

  actions: {
    // increment() {
    //   this.counter++
    // },
    toggleListPanel(open) {
      this.listPanelOpen = open !== undefined ? open : !this.listPanelOpen
    },
    updateFeatureInfoBoxState({ open, id }) {
      this.featureInfoBoxState = { open, id }
    },
    toggleBasemapPanel(open) {
      this.basemapPanelOpen = open !== undefined ? open : !this.basemapPanelOpen
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMaplibreStore, import.meta.hot))
}
