import { processData } from '../src/js/data';
import { SDS011_no_dust, SDS011_dust, DHT22 } from './dummy-data';

const flatSingle = arr => [].concat(...arr);

describe('filtering data', () => {
  it('should filter sensors without dust values', () => {
    const result = processData([{ ...SDS011_dust }, { ...SDS011_no_dust }], new Date('2019-05-10T09:40:58.505Z'));
    expect(flatSingle(result)).toHaveLength(1);
    expect(flatSingle(result)[0].p2val).toBe(0.02);
  });

  it('should filter non-SDS011 sensors', () => {
    const result = processData([{ ...SDS011_dust }, { ...DHT22 }], new Date('2019-05-10T09:40:58.505Z'));
    expect(flatSingle(result)).toHaveLength(1);
    expect(flatSingle(result)[0].p2val).toBe(0.02);
  });
});
