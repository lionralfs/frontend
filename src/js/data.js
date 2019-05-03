export const fetchData = async () => {
  const rawData = await fetch('http://api.luftdaten.info/static/v2/data.24h.json').then(r => r.json());
  const locationMap = new Map();

  rawData.forEach(e => {
    if (e.sensor.sensor_type.name !== 'SDS011') return;
    if (!e.location.latitude || !e.location.longitude) return;

    const p25results = e.sensordatavalues
      .filter(e => e.value_type === 'P2')
      .map(el => {
        el.timestamp = e.timestamp;
        return el;
      });
    if (!p25results.length) return;

    const locationId = `${e.location.latitude}-${e.location.longitude}`;
    const measurements = locationMap.get(locationId);

    if (measurements === undefined) {
      locationMap.set(locationId, { lat: e.location.latitude, lon: e.location.longitude, measurements: p25results });
    } else {
      measurements.measurements.push(p25results);
    }
  });

  return Array.from(locationMap.values()).map(e => {
    return { lat: parseFloat(e.lat), lng: parseFloat(e.lon), count: parseFloat(e.measurements[0].value) };
  });
};
