import * as UI from '@zos/ui'
import { px } from '@zos/utils'
import { ZoneRange } from '../utils/zones'
import { CommonUtils } from '../utils/common'

export class IndexPageUI {

  updateDuration() {
    const startTime = this.initialTime
    const currTime = CommonUtils.getEpochMillis()
    const diffSec = Math.floor((currTime - startTime) / 1000)
    const sec = diffSec % 60
    const min = Math.floor(diffSec / 60)
    const duration = `${min}:${sec.toString().padStart(2, '0')}`
    this.duration.setProperty(UI.prop.TEXT, duration)
  }

  setHeartRate(heartRate) {
    this.zoneRange.updateZone(heartRate)
    this.background.setProperty(UI.prop.COLOR, this.zoneRange.getBackgroundColor())
    this.heartRate.setProperty(UI.prop.TEXT, `${heartRate}`)
  }

  setCalories(calories) {
    this.calories.setProperty(UI.prop.TEXT, `${calories - this.initialCalories}`)
  }

  constructor(heartRate, calories) {
    const DEVICE_WIDTH = 454
    const PX_FULL = px(DEVICE_WIDTH)
    this.zoneRange = new ZoneRange(heartRate)
    this.initialCalories = calories
    this.initialTime = CommonUtils.getEpochMillis()

    //background color
    this.background = UI.createWidget(UI.widget.FILL_RECT, {
      x: px(0),
      y: px(0),
      w: PX_FULL,
      h: PX_FULL,
      color: this.zoneRange.getBackgroundColor()
    })

    //workout duration at top
    this.duration = UI.createWidget(UI.widget.TEXT, {
      x: px(0),
      y: px(30),
      w: PX_FULL,
      h: px(60),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: 55,
      text: '',
      color: this.zoneRange.getFontColor()
    })
    UI.createWidget(UI.widget.TEXT, {
      x: px(0),
      y: px(80),
      w: PX_FULL,
      h: px(50),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text: 'Workout Duration',
      color: this.zoneRange.getFontColor()
    })

    //heart rate at middle
    this.heartRate = UI.createWidget(UI.widget.TEXT, {
      x: px(0),
      y: px(180),
      w: PX_FULL,
      h: px(70),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: 70,
      text: heartRate,
      color: this.zoneRange.getFontColor()
    })
    UI.createWidget(UI.widget.TEXT, {
      x: px(0),
      y: px(240),
      w: PX_FULL,
      h: px(50),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text: 'Heart Rate',
      color: this.zoneRange.getFontColor()
    })

    //calories burnt at bottom
    this.calories = UI.createWidget(UI.widget.TEXT, {
      x: px(0),
      y: px(340),
      w: PX_FULL,
      h: px(60),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: 55,
      text: 0,
      color: this.zoneRange.getFontColor()
    })
    UI.createWidget(UI.widget.TEXT, {
      x: px(0),
      y: px(390),
      w: PX_FULL,
      h: px(50),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text: 'Calories',
      color: this.zoneRange.getFontColor()
    })
  }
}
