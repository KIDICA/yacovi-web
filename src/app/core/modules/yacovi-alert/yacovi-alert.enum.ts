export const YACOVI_ALERT_TYPES = {
  'SUCCESS': 'success',
  'ERROR': 'error'
};

export function YaCoViAlertTypesAware(constructor: Function) {
  constructor.prototype.YACOVI_ALERT_TYPES = YACOVI_ALERT_TYPES;
}
