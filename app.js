App({
  globalData: {},
  onCreate(options) {
    console.log('app on create invoke')
    this.setScreenKeep(true)
  },

  onDestroy(options) {
    console.log('app on destroy invoke')
  }
})
