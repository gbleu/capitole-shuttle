/* eslint-env jest */

import services from './index';

it('renders without crashing', async () => {
  const data = await services.trafficTo('capitole');
  expect(data).toBeFalsy();
  // expect(await services.trafficToDefense()).toBeFalsy();
});
