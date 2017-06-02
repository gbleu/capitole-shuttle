/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { Location, Permissions } from 'expo';

import LocationComp from './Location';
import services from '../services';

describe('Location component', () => {
  beforeEach(() => {
    jest.spyOn(services, 'guessOrigin');
    services.getNextDepartures = jest.fn(() => [null, null, null]);
    services.trafficBetween = jest.fn(() => 1);
  });
  afterEach(() => {
    services.guessOrigin.mockRestore();
    services.getNextDepartures.mockRestore();
    services.trafficBetween.mockRestore();
  });

  it('renders as expected', async () => {
    const wrapper = shallow(<LocationComp />);
    expect(wrapper).toMatchSnapshot();

    wrapper.setState({ errorMessage: 'errorMessage' });
    expect(wrapper).toMatchSnapshot();

    wrapper.setState({ errorMessage: null, origin: { key: 'defense' } });
    expect(wrapper).toMatchSnapshot();

    wrapper.setState({ errorMessage: null, origin: { key: 'capitole' } });
    expect(wrapper).toMatchSnapshot();

    wrapper.setState({ departures: [new Date(0, 0, 0, 0, 0, 0, 0), null, null], traffic: 2 });
    expect(wrapper).toMatchSnapshot();

    const julius = {
      coords: { latitude: 48.888808, longitude: 2.2100604 }
    };
    await wrapper.instance().updateLocation(julius);
    expect(wrapper).toMatchSnapshot();
    expect(services.guessOrigin).toBeCalledWith(julius.coords);

    const remove = jest.fn();
    wrapper.setState({ sub: { remove } });
    wrapper.unmount();
    expect(wrapper).toMatchSnapshot();
    expect(remove).toBeCalled();
  });

  describe('getLocation', () => {
    describe('when permission not granted', () => {
      beforeEach(() => {
        Permissions.askAsync = jest.fn(() => ({ status: 'refused' }));
      });
      afterEach(() => {
        Permissions.askAsync.mockRestore();
      });

      it('should print error message', async () => {
        const wrapper = shallow(<LocationComp />);
        await wrapper.instance().getLocation();
        expect(Permissions.askAsync).toBeCalledWith(Permissions.LOCATION);
        expect(wrapper.state().errorMessage).toBe('Permission to access location was denied');
      });
    });

    describe('when permission granted', () => {
      beforeEach(() => {
        Permissions.askAsync = jest.fn(() => ({ status: 'granted' }));
        Location.getCurrentPositionAsync = jest.fn(() => ({
          coords: { latitude: 0, longitude: 0 }
        }));
      });
      afterEach(() => {
        Permissions.askAsync.mockRestore();
        Location.getCurrentPositionAsync.mockRestore();
      });

      it('should get location', async () => {
        const wrapper = shallow(<LocationComp />);
        await wrapper.instance().getLocation();
        expect(Permissions.askAsync).toBeCalledWith(Permissions.LOCATION);
        expect(wrapper.state().location).toMatchObject({ coords: { latitude: 0, longitude: 0 } });
      });
    });
  });
});
