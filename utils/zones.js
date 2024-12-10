import { getProfile } from '@zos/user'

const Zones = ['zone0', 'zone1', 'zone2', 'zone3', 'zone4', 'zone5']

const ZoneNames = {
  zone0: "Rest",
  zone1: "WarmUp",
  zone2: "FatBurn",
  zone3: "Aerobic",
  zone4: "Anaerobic",
  zone5: "Max",
}

const ZoneColors = {
  zone0: 0xFFFFFF, // White
  zone1: 0xADD8E6, // Deep Blue
  zone2: 0x32CD32, // Forest Green
  zone3: 0xFFD700, // Golden Yellow
  zone4: 0xFF8C00, // Bright Orange
  zone5: 0xFF4500, // Crimson Red
}

const ZonePercent = {
  zone0: 50,
  zone1: 60,
  zone2: 70,
  zone3: 80,
  zone4: 90,
  zone5: 100
}

export class ZoneRange {

  constructor(heartRate) {
    this.zoneId = 0
    this.zones = []

    const profile = getProfile()
    const age = profile.age || 30
    const maxHeartRate = 220 - age
    var prevZone = 0
    var zoneId = 0
    Zones.forEach((zone) => {
      var zonePercent = ZonePercent[zone]
      this.zones.push({
        id: zoneId++,
        zone: zone,
        name: ZoneNames[zone],
        color: ZoneColors[zone],
        min: prevZone * maxHeartRate / 100,
        max: zonePercent * maxHeartRate / 100
      })
      prevZone = zonePercent
    })

    this.updateZone(heartRate)
  }

  updateZone(heartRate) {
    console.log(JSON.stringify(this.zones))
    var zone = this.zones.find((zone) => {
      return heartRate > zone.min && heartRate < zone.max
    }) || zones[zones.length - 1]
    this.zoneId = zone.id
    console.log(`hr:${heartRate} zoneId:${this.zoneId} zone:${JSON.stringify(zone)}`)
  }

  getFontColor() {
    return 0x000000
  }

  getBackgroundColor() {
    return this.zones[this.zoneId].color
  }

}
