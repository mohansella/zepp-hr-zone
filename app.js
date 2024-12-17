import * as UI from "@zos/display"
import { onGesture } from "@zos/interaction"

App({

  globalData: {},

  onCreate() {
    console.log('app on create invoke')

    //disable screen lock
    UI.pauseDropWristScreenOff({ duration: 0 })
    UI.pausePalmScreenOff({ duration: 0 })
    UI.setWakeUpRelaunch({ relaunch: true })

    //disable guestures
    onGesture({
      callback: () => {
        return true
      }
    })
  },

  onDestroy() {
    console.log('app on destroy invoke')
  }
})
