import * as UI from '@zos/ui'
import { px } from '@zos/utils'
import { ZoneManager, Zones } from '../utils/zones'
import { CommonUtils } from '../utils/common'

const FS_TITLE = 48
const FS_SUBTITLE = 28

const DEVICE_WIDTH = 454
const PX_FULL = px(DEVICE_WIDTH)
const PX_LEFTX = PX_FULL * 1.5 / 10
const PX_RIGHTX = PX_FULL * 5.5 / 10
const PX_WIDTH = PX_FULL * 3 / 10


export class IndexPageUI {

  constructor(heartRate, calories) {
    this.zoneManager = new ZoneManager(heartRate)
    this.targetZone = this.zoneManager.getZone(Zones.FatBurn)
    console.log(`targetZone:${JSON.stringify(this.targetZone)}`)
    this.initialCalories = calories
    this.initialTime = CommonUtils.getEpochMillis()
    this.heartRateData = [
      { time: 0, hr: heartRate},
      { time: CommonUtils.getEpochMillis(), hr: heartRate }
    ]

    this.initBackground()
    this.initArc()

    this.initDuration()
    this.initCalories()

    this.initHeartRate(heartRate)
    this.initGraph()

    this.initSteps()
    this.initDistance()
  }

  updateGraph() {
    const millis = CommonUtils.getEpochMillis()
    const lineDataList = []
    const lowHeight = (this.graphHeight - this.graphZoneHeight) / 2
    const highHeight = (this.graphHeight - this.graphZoneHeight) / 2
    const zoneMin = this.targetZone.minHR
    const zoneMax = this.targetZone.maxHR
    for(var i = 0; i < this.heartRateData.length; i++) {
      const data = this.heartRateData[i]
      const timeDelta = millis - data.time
      let x = timeDelta * this.graphWidth / 1000 / 60
      if(x > this.graphWidth) {
        x = this.graphWidth
      }
      if(data.hr < zoneMin) {
        y = data.hr / zoneMin //0-1
        y = y * lowHeight
      } else if(data.hr < zoneMax) {
        y = (data.hr - zoneMin) / (zoneMax - zoneMin) //0-1
        y = lowHeight + (y * this.graphZoneHeight)
      } else {
        const maxHR = this.zoneManager.getMaxHeartRate()
        y = data.hr < maxHR ? data.hr : maxHR
        y = (y - zoneMax) / (maxHR - zoneMax) //0-1
        y = lowHeight + this.graphZoneHeight + (y * highHeight)
      }
      y = this.graphHeight - y //inverse due to y from top
      lineDataList.push({x:x, y:y})
    }
    console.log(`${JSON.stringify(lineDataList)}`)
    this.polyline.clear()
    this.polyline.addLine({
      data: lineDataList,
      count: lineDataList.length
    })
  }

  updateDuration() {
    const startTime = this.initialTime
    const currTime = CommonUtils.getEpochMillis()
    const diffSec = Math.floor((currTime - startTime) / 1000)
    const sec = diffSec % 60
    const min = Math.floor(diffSec / 60) % 60
    const hour = Math.floor(diffSec / 60 / 60)
    const hourStr = hour > 0 ? `${hour}:` : ''
    const duration = `${hourStr}${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    this.duration.setProperty(UI.prop.TEXT, duration)
  }

  setHeartRate(heartRate) {
    this.zoneManager.update(heartRate)
    this.heartRateData.push({
      time: CommonUtils.getEpochMillis(),
      hr: heartRate
    })
    this.updateGraph()
    this.background.setProperty(UI.prop.COLOR, this.zoneManager.getCurrZone().color)
    this.heartRate.setProperty(UI.prop.TEXT, `${heartRate}`)
  }

  setCalories(calories) {
    this.calories.setProperty(UI.prop.TEXT, `${calories - this.initialCalories}`)
  }

  initBackground() {
    this.background = UI.createWidget(UI.widget.FILL_RECT, {
      x: px(0),
      y: px(0),
      w: PX_FULL,
      h: PX_FULL,
      color: this.zoneManager.getCurrZone().color
    })
  }

  initArc() {
    this.arc = UI.createWidget(UI.widget.ARC, {
      x: px(0) - PX_FULL / 2,
      y: px(0) - PX_FULL / 2,
      w: PX_FULL * 2,
      h: PX_FULL * 2,
      start_angle: 0,
      end_angle: 360,
      color: 0x000000,
      line_width: PX_FULL / 2
    })
  }

  initGraph() {
    const FS_CURSOR = 14
    const grayColor = 0x0
    const PX_X = PX_FULL / 2
    const PX_W = PX_FULL * 4 / 10
    const PX_E = PX_FULL * 9 / 10
    //top black line
    UI.createWidget(UI.widget.FILL_RECT, {
      x: PX_X,
      y: px(200),
      w: PX_W,
      h: 1,
      color: 0
    })
    //bottom black line
    UI.createWidget(UI.widget.FILL_RECT, {
      x: PX_X,
      y: px(260),
      w: PX_W,
      h: 1,
      color: 0
    })
    this.graphHeight = px(260) - px(200)
    this.graphWidth = PX_W
    //top gray line
    UI.createWidget(UI.widget.FILL_RECT, {
      x: PX_X,
      y: px(220),
      w: PX_W,
      h: 1,
      color: grayColor,
    })
    //bottom gray line
    UI.createWidget(UI.widget.FILL_RECT, {
      x: PX_X,
      y: px(240),
      w: PX_W,
      h: 1,
      color: grayColor
    })
    this.graphZoneHeight = px(240) - px(220)
    //top gray text
    UI.createWidget(UI.widget.TEXT, {
      x: PX_E,
      y: px(200),
      w: px(30),
      h: px(40),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: FS_CURSOR,
      text: this.targetZone.maxHR,
      color: grayColor
    })
    //bottom gray text
    UI.createWidget(UI.widget.TEXT, {
      x: PX_E,
      y: px(220),
      w: px(30),
      h: px(40),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: FS_CURSOR,
      text: this.targetZone.minHR,
      color: grayColor
    })
    //left cursor line
    UI.createWidget(UI.widget.FILL_RECT, {
      x: PX_X,
      y: px(260) - 4,
      w: 1,
      h: 9,
      color: grayColor
    })
    //left cursor text
    UI.createWidget(UI.widget.TEXT, {
      x: (PX_X) - 1,
      y: px(265),
      w: px(30),
      h: px(20),
      align_h: UI.align.LEFT,
      align_v: UI.align.CENTER_V,
      text_size: FS_CURSOR,
      text: '0:00',
      color: grayColor
    })
    //middle cursor line
    UI.createWidget(UI.widget.FILL_RECT, {
      x: PX_FULL * 7 / 10,
      y: px(260) - 4,
      w: 1,
      h: 9,
      color: grayColor
    })
    //middle cursor text
    UI.createWidget(UI.widget.TEXT, {
      x: (PX_FULL * 7 / 10) - 10,
      y: px(265),
      w: px(30),
      h: px(20),
      align_h: UI.align.CENTER_V,
      align_v: UI.align.CENTER_V,
      text_size: FS_CURSOR,
      text: '0:30',
      color: grayColor
    })
    //bottom cursor line
    UI.createWidget(UI.widget.FILL_RECT, {
      x: PX_E,
      y: px(260) - 4,
      w: 1,
      h: 9,
      color: grayColor
    })
    //bottom cursor text
    UI.createWidget(UI.widget.TEXT, {
      x: (PX_E) - 28,
      y: px(265),
      w: px(30),
      h: px(20),
      align_h: UI.align.RIGHT,
      align_v: UI.align.CENTER_V,
      text_size: FS_CURSOR,
      text: '1:00',
      color: grayColor
    })

    this.polyline = UI.createWidget(UI.widget.GRADKIENT_POLYLINE, {
      x: PX_X,
      y: px(200),
      w: PX_W,
      h: px(60)
    })
    this.updateGraph()
  }

  initDuration() {
    this.duration = UI.createWidget(UI.widget.TEXT, {
      x: PX_LEFTX,
      y: px(70),
      w: PX_WIDTH,
      h: px(60),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: FS_TITLE,
      text: '',
      color: 0
    })
    UI.createWidget(UI.widget.TEXT, {
      x: PX_LEFTX,
      y: px(115),
      w: PX_WIDTH,
      h: px(50),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: FS_SUBTITLE,
      text: 'Duration',
      color: 0
    })
  }

  initCalories() {
    this.initialCalories = calories
    this.calories = UI.createWidget(UI.widget.TEXT, {
      x: PX_RIGHTX,
      y: px(70),
      w: PX_WIDTH,
      h: px(60),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: FS_TITLE,
      text: 0,
      color: 0
    })
    UI.createWidget(UI.widget.TEXT, {
      x: PX_RIGHTX,
      y: px(115),
      w: PX_WIDTH,
      h: px(50),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: FS_SUBTITLE,
      text: 'Calories',
      color: 0
    })
  }

  initHeartRate(heartRate) {
    this.heartRate = UI.createWidget(UI.widget.TEXT, {
      x: PX_LEFTX,
      y: px(180),
      w: PX_WIDTH,
      h: px(80),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: 80,
      text: heartRate,
      color: 0
    })
    UI.createWidget(UI.widget.TEXT, {
      x: PX_LEFTX,
      y: px(245),
      w: PX_WIDTH,
      h: px(50),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text: 'Heart Rate',
      color: 0
    })
  }

  initSteps() {
    this.steps = UI.createWidget(UI.widget.TEXT, {
      x: PX_LEFTX,
      y: px(305),
      w: PX_WIDTH,
      h: px(60),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: FS_TITLE,
      text: '3545',
      color: 0
    })
    UI.createWidget(UI.widget.TEXT, {
      x: PX_LEFTX,
      y: px(350),
      w: PX_WIDTH,
      h: px(50),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: FS_SUBTITLE,
      text: 'Steps',
      color: 0
    })
  }

  initDistance() {
    this.distance = UI.createWidget(UI.widget.TEXT, {
      x: PX_RIGHTX,
      y: px(305),
      w: PX_WIDTH,
      h: px(60),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: FS_TITLE,
      text: '1.25 k',
      color: 0
    })
    UI.createWidget(UI.widget.TEXT, {
      x: PX_RIGHTX,
      y: px(350),
      w: PX_WIDTH,
      h: px(50),
      align_h: UI.align.CENTER_H,
      align_v: UI.align.CENTER_V,
      text_size: FS_SUBTITLE,
      text: 'Distance',
      color: 0
    })
  }


}
