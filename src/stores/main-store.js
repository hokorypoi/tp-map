import { defineStore, acceptHMRUpdate } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    // counter: 0,
    leftDrawerOpen: false,
    listPanelOpen: false,

    addRoadDialogOpen: false,
    modifyRoadDialogData: { open: false, id: undefined },

    coordinateConvertDialogOpen: false,
  }),

  getters: {
    // doubleCount: (state) => state.counter * 2,
  },

  actions: {
    // increment() {
    //   this.counter++
    // },
    toggleLeftDrawer(open) {
      this.leftDrawerOpen = open !== undefined ? open : !this.leftDrawerOpen
    },
    toggleListPanel(open) {
      this.listPanelOpen = open !== undefined ? open : !this.listPanelOpen
    },
    toggleAddRoadDialog(open) {
      this.addRoadDialogOpen = open !== undefined ? open : !this.addRoadDialogOpen
    },
    updateModifyRoadDialogData({ open, id }) {
      this.modifyRoadDialogData = { open, id }
    },


    toggleCoordinateConvertDialog(open) {
      this.coordinateConvertDialogOpen = open !== undefined ? open : !this.coordinateConvertDialogOpen
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
