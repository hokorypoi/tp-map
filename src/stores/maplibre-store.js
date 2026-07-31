import { defineStore, acceptHMRUpdate } from 'pinia'

export const useMaplibreStore = defineStore('maplibre', {
  state: () => ({
    // counter: 0,
    listPanelOpen: false,
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
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMaplibreStore, import.meta.hot))
}
