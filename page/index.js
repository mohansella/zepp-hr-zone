import AutoGUI from '@silver-zepp/autogui'
import { HeartRate, Time, Vibrator, VIBRATOR_SCENE_DURATION_LONG } from '@zos/sensor'
import { getProfile } from '@zos/user'
import { pausePalmScreenOff, pauseDropWristScreenOff, setWakeUpRelaunch } from '@zos/display'

const COLOR_BLACK = 0x000000
const COLOR_WARMUP = 0x4A90E2
const COLOR_FATBURN = 0x7ED321
const COLOR_ANEAROBIC = 0xF5A623

Page({
  build() {
    pauseDropWristScreenOff({ duration: 0 })
    pausePalmScreenOff({ duration: 0 })
    setWakeUpRelaunch({ relaunch: true })

    const gui = new AutoGUI()
    const time = new Time()
    const heart = new HeartRate()

    const vo2max = 220 - (getProfile().age || 30)
    const minhr = vo2max * 0.62
    const maxhr = vo2max * 0.68
    console.log(`vo2max:${vo2max} minhr:${minhr} maxhr:${maxhr}`)

    gui.startGroup()
    const tRect = gui.fillRect(COLOR_BLACK)
    const timeWidget = gui.text('00:00')
    gui.newRow()
    gui.endGroup()
    gui.startGroup()
    const bRect = gui.fillRect(COLOR_BLACK)
    const hrWidget = gui.text('-', { text_size: 50 })
    gui.endGroup()

    let lastHr = heart.getLast()
    let lastVibrate = 0
    const updateHr = function(currHr) {
      hrWidget.update({ text: currHr.toString() })
      console.log(`currHr: ${currHr}`)
      if (currHr > maxhr) {
        tRect.update({ color: COLOR_ANEAROBIC })
        bRect.update({ color: COLOR_ANEAROBIC })
        console.log('COLOR_ANEAROBIC')
      } else if (currHr < minhr) {
        tRect.update({ color: COLOR_WARMUP })
        bRect.update({ color: COLOR_WARMUP })
        console.log('COLOR_WARMUP')
      } else {
        tRect.update({ color: COLOR_FATBURN })
        bRect.update({ color: COLOR_FATBURN })
        console.log('COLOR_FATBURN')
        lastVibrate = 0
      }
      lastHr = currHr
    }
    updateHr(lastHr)

    const startTime = time.getTime()
    setInterval(() => {
      const currTime = time.getTime()
      const timeSpent = (currTime - startTime) / 1000
      const seconds = `${Math.floor(timeSpent % 60)}`.padStart(2, '0')
      const mins = `${Math.floor(timeSpent / 60)}`.padStart(2, '0')
      timeWidget.update({ text: `${mins}:${seconds}` })

      const vibrator = new Vibrator()
      if (currTime - lastVibrate > 1 * 5000) {
        if (lastHr > maxhr) {
          vibrator.setMode(VIBRATOR_SCENE_DURATION_LONG)
          console.log('max vibration')
          vibrator.start()
          lastVibrate = currTime
        } else if (lastHr < minhr) {
          lastVibrate = currTime
          vibrator.setMode(VIBRATOR_SCENE_STRONG_REMINDER)
          console.log('min vibration')
          vibrator.start()
        }
      }
    }, 200)

    heart.onCurrentChange(() => {
      updateHr(heart.getCurrent())
    })

    gui.render()
  }
})
