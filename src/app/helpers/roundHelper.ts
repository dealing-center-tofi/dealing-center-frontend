const config = require('./../../../config/api.conf');

export class RoundHelper {
  static round(item, defaultValue='') {
    return (item != undefined) ? item.toFixed(config.rankRound) : defaultValue;
  }
}
