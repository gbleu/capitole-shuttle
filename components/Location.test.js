/* eslint-env jest */

import React from 'react';
import { shallow, mount } from 'enzyme';

import Location from './Location';

describe('Location component', () => {
  it('renders as expected', () => {
    const wrapper = shallow(<Location />);
    expect(wrapper).toMatchSnapshot();
    wrapper.setState({ errorMessage: 'errorMessage' });
    expect(wrapper).toMatchSnapshot();
    wrapper.setState({ errorMessage: null, origin: { key: 'defense' } });
    expect(wrapper).toMatchSnapshot();
    wrapper.setState({ errorMessage: null, origin: { key: 'capitole' } });
    expect(wrapper).toMatchSnapshot();
    wrapper.setState({ departures: [new Date(0, 0, 0, 0, 0, 0, 0), null, null], traffic: 2 });
    expect(wrapper).toMatchSnapshot();
  });

  it('unmount as expected', () => {
    const wrapper = mount(<Location />);
    wrapper.unmount();
    expect(wrapper).toMatchSnapshot();
  });
});
