/* eslint-env jest */
import fetchMock from 'jest-fetch-mock';

import services from './index';
import conf from '../conf';

beforeAll(() => {
  global.fetch = fetchMock;
});

describe('services', () => {
  describe('trafficBetween', () => {
    it('correctly parse api response', async () => {
      fetch.mockResponse(JSON.stringify({
        rows: [{
          elements: [{
            distance: {
              text: '2,5 km',
              value: 2482
            },
            duration: {
              text: '6 minutes',
              value: 379
            },
            duration_in_traffic: {
              text: '11 minutes',
              value: 636
            },
            status: 'OK'
          }]
        }],
        status: 'OK'
      }));

      const traffic = await services.trafficBetween({ placeId: 'origin' }, { placeId: 'destination' });
      expect(traffic).toEqual(4);
    });
  });

  describe('trafficTo', () => {
    beforeEach(() => {
      services.trafficBetween = jest.fn();
    });
    afterEach(() => {
      services.trafficBetween.mockRestore();
    });

    describe('when called with defense', () => {
      it('calls between capitole -> defense', async () => {
        await services.trafficTo('defense');
        expect(services.trafficBetween).toBeCalledWith(conf.spots.capitole, conf.spots.defense);
      });
    });
    describe('when called with capitole', () => {
      it('calls between defense -> capitole', async () => {
        await services.trafficTo('capitole');
        expect(services.trafficBetween).toBeCalledWith(conf.spots.defense, conf.spots.capitole);
      });
    });
  });

  describe('guessOrigin', () => {
    it('should return capitole from julius', () => {
      const julius = { latitude: 48.888808, longitude: 2.2100604 };
      const res = services.guessOrigin(julius);
      expect(res.key).toEqual('capitole');
    });
  });

  describe('getNextDepartures', () => {
    describe('when first departure of day', () => {
      beforeEach(() => {
        const date = new Date(0, 0, 0, 6, 0);
        global.Date = jest.fn(() => date);
      });
      afterEach(() => {
        global.Date.mockRestore();
      });
      it('should return first and second departures', () => {
        const res = services.getNextDepartures('defense');
        expect(res).toHaveLength(3);
        expect(res[0]).toBeNull();
        expect(res[1].getHours()).toBe(7);
        expect(res[1].getMinutes()).toBe(7);
        expect(res[2].getHours()).toBe(7);
        expect(res[2].getMinutes()).toBe(15);
      });
    });
  });
});
