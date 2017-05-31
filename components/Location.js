import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import moment from 'moment';

import services from '../services';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Invariant Violation: Invalid prop `paddingTop` supplied to `StyleSheet container`.
    // paddingTop: Constants.statusBarHeight,
    paddingTop: 20,
    backgroundColor: '#ecf0f1'
  },
  paragraph: {
    margin: 24,
    fontSize: 26,
    textAlign: 'center'
  }
});

export default class App extends Component {
  state = {
    location: null,
    sub: null,
    origin: {},
    departures: [null, null, null],
    traffic: null,
    errorMessage: null
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      });
    } else {
      // get initial location
      this.getLocation();
      // watch location
      this.watchLocation();
      // refresh departures every minute
      this.interval = setInterval(this.updateDepartures, 1 * 60 * 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);

    if (this.state.sub) {
      this.state.sub.remove();
    }
  }

  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
      return;
    }

    console.log('get current location');
    const location = await Location.getCurrentPositionAsync({});
    await this.updateLocation(location);
  };

  watchLocation = async () => {
    console.log('watch current location');
    const sub = Location.watchPositionAsync({}, (location) => {
      console.log('new location received');
      this.updateLocation(location);
    });
    this.setState({ sub });
  };

  updateLocation = async (location) => {
    console.log('update location', JSON.stringify(location));

    const origin = services.guessOrigin(location.coords);
    console.log('origin', JSON.stringify(origin));

    this.setState({ location, origin });
    console.log('location updated');

    await this.updateDepartures();
  };

  updateDepartures = async () => {
    const { origin } = this.state;

    const departures = services.getNextDepartures(origin.key);
    console.log('departures', JSON.stringify(departures));

    const traffic = await services.trafficTo(origin.key);
    console.log(`traffic +${traffic} min.`);

    this.setState({ departures, traffic });
    console.log('departures updated');
  };

  format = (date) => {
    if (!date) return '--:--';

    return date && moment(date).format('HH[h]mm');
  };

  render() {
    let text = 'acquiring location ...';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.origin.key) {
      if (this.state.origin.key === 'defense') {
        text = 'defense -> capitole';
      } else {
        text = 'capitole -> defense';
      }
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
        <View style={{ flexDirection: 'row' }}>{
          // eslint-disable-next-line react/no-array-index-key
          this.state.departures.map((it, i) => <Text key={`departure-${i}`} style={styles.paragraph}>{this.format(it)}</Text>)
        }</View>
        {this.state.traffic && <Text style={styles.paragraph}>+{this.state.traffic} min.</Text>}
      </View>
    );
  }
}
