import { getProfile } from '@zos/user'

export const Zones = {
  Rest: 'Rest',
  Warmup: 'Warmup',
  FatBurn: 'FatBurn',
  Aerobic: 'Aerobic',
  Anaerobic: 'Anaerobic',
  Max: 'Max'
}

export class Zone {
  
  constructor(params) {
    this.id = params.id
    this.name = params.name
    this.color = params.color
    this.minPer = params.minPer
    this.maxPer = params.maxPer
  }

  computeHeartRate(maxHeartRate) {
    this.minHR = maxHeartRate * this.minPer / 100
    this.maxHR = maxHeartRate * this.maxPer / 100
  }

  static getDefaultZones() {
    return [
      new Zone({ id: 0, name: Zones.Rest, color: 0xFFFFFF, maxPer: 50 }),
      new Zone({ id: 1, name: Zones.Warmup, color: 0xADD8E6, minPer: 50, maxPer: 60 }),
      new Zone({ id: 2, name: Zones.FatBurn, color: 0x32CD32, minPer: 60, maxPer: 70 }),
      new Zone({ id: 3, name: Zones.Aerobic, color: 0xFFD700, minPer: 70, maxPer: 80 }),
      new Zone({ id: 4, name: Zones.Anaerobic, color: 0xFF8C00, minPer: 80, maxPer: 90 }),
      new Zone({ id: 5, name: Zones.Max, color: 0xFF4500, minPer: 90 })
    ]
  }

}

export class ZoneManager {

  constructor(heartRate) {
    this.currZoneId = 0
    this.allZones = Zone.getDefaultZones()

    const profile = getProfile()
    const age = profile.age || 30
    const maxHeartRate = 220 - age

    this.allZones.forEach((zone) => {
      zone.computeHeartRate(maxHeartRate)
    })
    this.maxHeartRate = maxHeartRate

    this.update(heartRate)
  }

  update(heartRate) {
    var zone = this.allZones.find((zone) => {
      return heartRate > (zone.minHR || 0) && heartRate < zone.maxHR
    }) || this.allZones[this.allZones.length - 1]
    this.currZoneId = zone.id
    console.log(`ZoneManager.update() hr:${heartRate} 
        zoneId:${this.currZoneId} zone:${JSON.stringify(zone)}`)
  }

  getCurrZone() {
    return this.allZones[this.currZoneId]
  }

  getZone(zoneName) {
    return this.allZones.find((zone) => {
      return zone.name == zoneName
    })
  }

  getMaxHeartRate() {
    return this.maxHeartRate
  }

}
