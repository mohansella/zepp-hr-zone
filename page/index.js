import { IndexPageUI } from './index.ui'
import { Calorie, HeartRate } from '@zos/sensor'

Page({
  build() {
    const heartSensor = new HeartRate()
    const calorieSensor = new Calorie()
    const initialHr = heartSensor.getCurrent()
    const initialCals = calorieSensor.getCurrent()

    const ui = new IndexPageUI(initialHr, initialCals)

    //workout duration
    ui.updateDuration()
    setInterval(() => {
      ui.updateDuration()
    }, 100)

    //heart rate
    heartSensor.onCurrentChange(() => {
      const currHeartRate = heartSensor.getCurrent()
      ui.setHeartRate(currHeartRate)
    })

    //calories
    calorieSensor.onChange(() => {
      ui.setCalories(calorieSensor.getCurrent())
    })

  }
})
