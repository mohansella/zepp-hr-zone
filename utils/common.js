import { Time } from '@zos/sensor'

export class CommonUtils {

  static getEpochMillis() {
    return new Time().getTime()
  }

}
