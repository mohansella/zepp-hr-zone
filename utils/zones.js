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

export class ZoneManager {

  constructor(heartRate) {
    this.currZoneId = 0
    this.allZones = []

    const profile = getProfile()
    const age = profile.age || 30
    const maxHeartRate = 220 - age
    var prevZone = 0
    var zoneId = 0
    Zones.forEach((zone) => {
      var zonePercent = ZonePercent[zone]
      this.allZones.push({
        id: zoneId++,
        zone: zone,
        name: ZoneNames[zone],
        color: ZoneColors[zone],
        min: prevZone * maxHeartRate / 100,
        max: zonePercent * maxHeartRate / 100
      })
      prevZone = zonePercent
    })
    this.maxHeartRate = maxHeartRate

    this.update(heartRate)
  }

  update(heartRate) {
    var zone = this.allZones.find((zone) => {
      return heartRate > zone.min && heartRate < zone.max
    }) || this.allZones[this.allZones.length - 1]
    this.currZoneId = zone.id
    console.log(`hr:${heartRate} zoneId:${this.currZoneId} zone:${JSON.stringify(zone)}`)
  }

  getCurrFontColor() {
    return 0
  }

  getCurrBackgroundColor() {
    //return 0xFFFFFF
    return this.allZones[this.currZoneId].color
  }

  getCurrZoneMin() {
    return this.allZones[this.currZoneId].min
  }

  getCurrZoneMax() {
    return this.allZones[this.currZoneId].max
  }

  getZone(zoneName) {
    return this.allZones.find((zone) => {
      return zone.name == zoneName
    })
  }

  getZoneMin(zoneName) {
    const zone = getZone(zoneName)
    return zone && zone.min
  }

  getZoneMax(zoneName) {
    const zone = getZone(zoneName)
    return zone && zone.max
  }

  getMaxHeartRate() {
    return this.maxHeartRate
  }

}
