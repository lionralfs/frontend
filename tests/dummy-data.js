export const SDS011_no_dust = {
  id: 3589457589,
  sampling_rate: null,
  timestamp: '2019-05-10 09:09:18',
  location: {
    id: 13208,
    latitude: '51.044',
    longitude: '13.746',
    altitude: '',
    country: 'DE',
    exact_location: 0,
    indoor: 1
  },
  sensor: {
    id: 36,
    pin: '1',
    sensor_type: {
      id: 14,
      name: 'SDS011',
      manufacturer: 'Nova Fitness'
    }
  },
  sensordatavalues: [
    {
      id: 7612102241,
      value: '34.41',
      value_type: 'humidity'
    }
  ]
};

export const SDS011_dust = {
  id: 3589457524,
  sampling_rate: null,
  timestamp: '2019-05-10 09:09:17',
  location: {
    id: 13208,
    latitude: '51.044',
    longitude: '13.746',
    altitude: '',
    country: 'DE',
    exact_location: 0,
    indoor: 1
  },
  sensor: {
    id: 36,
    pin: '1',
    sensor_type: {
      id: 14,
      name: 'SDS011',
      manufacturer: 'Nova Fitness'
    }
  },
  sensordatavalues: [
    {
      id: 7612102109,
      value: '0.02',
      value_type: 'P1'
    },
    {
      id: 7612102110,
      value: '0.02',
      value_type: 'P2'
    }
  ]
};

export const DHT22 = {
  id: 3589462698,
  sampling_rate: null,
  timestamp: '2019-05-10 09:10:10',
  location: {
    id: 13592,
    latitude: '50.838',
    longitude: '4.412',
    altitude: '81.6',
    country: 'BE',
    exact_location: 0,
    indoor: 0
  },
  sensor: {
    id: 25741,
    pin: '7',
    sensor_type: {
      id: 9,
      name: 'DHT22',
      manufacturer: 'various'
    }
  },
  sensordatavalues: [
    {
      id: 7612113029,
      value: '76.48',
      value_type: 'humidity'
    },
    {
      id: 7612113010,
      value: '14.43',
      value_type: 'temperature'
    }
  ]
};
