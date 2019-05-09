function isSDS011(measurement) {
  return measurement.sensor.sensor_type.name === 'SDS011';
}

function isP2Value(value) {
  return value.value_type === 'P2';
}

function hasP2Values(measurement) {
  return measurement.sensordatavalues.find(isP2Value) !== undefined;
}

function isString(val) {
  return typeof val === 'string';
}

function notEmpty(str) {
  return str.length > 0;
}

function hasLocationData(measurement) {
  const { longitude, latitude } = measurement.location;
  return and(isString, notEmpty)(latitude) && and(isString, notEmpty)(longitude);
}

function modifyParseDate(measurement) {
  const measurementTime = new Date(`${measurement.timestamp}Z`);
  measurement.timestamp = measurementTime;
  return measurement;
}

function modifyExtractP2Value(measurement) {
  const p2Val = parseFloat(measurement.sensordatavalues.find(isP2Value).value);
  delete measurement.sensordatavalues;
  measurement.p2val = p2Val;
  return measurement;
}

function modifyDeleteExtraFields(measurement) {
  delete measurement.id;
  delete measurement.sampling_rate;
  delete measurement.sensor;
  delete measurement.location;
  return measurement;
}

function modifyParseCoordinates(measurement) {
  measurement.lat = parseFloat(measurement.location.latitude);
  measurement.lng = parseFloat(measurement.location.longitude);
  return measurement;
}

function and(...fns) {
  return function(...args) {
    for (const fn of fns) {
      if (!fn(...args)) return false;
    }
    return true;
  };
}

function pipe(...fns) {
  return function(...args) {
    return fns.reduce((acc, fn, i) => {
      return i === 0 ? fn(...args) : fn(acc);
    }, null);
  };
}

export const fetchData = async () => {
  const rawData = await fetch('http://api.luftdaten.info/static/v2/data.24h.json').then(r => r.json());
  const filteredMeasurements = rawData.filter(and(isSDS011, hasLocationData, hasP2Values));
  const cleanMeasurements = filteredMeasurements.map(
    pipe(
      modifyParseDate,
      modifyExtractP2Value,
      modifyParseCoordinates,
      modifyDeleteExtraFields
    )
  );

  const locationMap = new Map();
  const timeSpans = new Array(24).fill(0).map(() => []);
  const now = Date.now();

  for (const measurement of cleanMeasurements) {
    const hoursSince = Math.floor((now - measurement.timestamp) / (60 * 60 * 1000));

    if (hoursSince < 0 || hoursSince > 23) continue;
    timeSpans[hoursSince].push(measurement);
  }

  return timeSpans;
};
