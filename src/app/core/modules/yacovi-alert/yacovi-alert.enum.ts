export const YACOVI_ALERT_TYPES = {
  'SUCCESS': 'success',
  'ERROR': 'error'
};

export function YaCoviAlertTypesAware(constructor: Function) {
  constructor.prototype.YACOVI_ALERT_TYPES = YACOVI_ALERT_TYPES;
}
