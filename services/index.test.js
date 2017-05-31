/* eslint-env jest */
import fetchMock from 'jest-fetch-mock';

import services from './index';

beforeAll(() => {
  global.fetch = fetchMock;
});

describe('services', () => {
  describe('trafficTo', () => {
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

      const traffic = await services.trafficTo('capitole');
      expect(traffic).toEqual(4);
    });
  });
});
