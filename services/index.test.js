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
});
