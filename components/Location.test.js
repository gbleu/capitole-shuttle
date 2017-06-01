/* eslint-env jest */

import React from 'react';
import renderer from 'react-test-renderer';

import Location from './Location';

it('renders without crashing', () => {
  const rendered = renderer.create(<Location />).toJSON();
  expect(rendered).toMatchSnapshot();
});
