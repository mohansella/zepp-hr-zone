import { IndexPageUI } from './index.ui'
import { Calorie, Distance, HeartRate, Step } from '@zos/sensor'

Page({
  build() {
    const heartSensor = new HeartRate()
    const calorieSensor = new Calorie()
    const stepsSensor = new Step()
    const distanceSensor = new Distance()
    const initialHr = heartSensor.getCurrent()
    const initialCals = calorieSensor.getCurrent()
    const initialSteps = stepsSensor.getCurrent()
    const initialDistance = distanceSensor.getCurrent()

    const ui = new IndexPageUI(initialHr, initialCals, initialSteps, initialDistance)

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

    //steps
    stepsSensor.onChange(() => {
      ui.setSteps(stepsSensor.getCurrent())
    })

    //distance
    distanceSensor.onChange(() => {
      ui.setDistance(distanceSensor.getCurrent())
    })

  }
})
