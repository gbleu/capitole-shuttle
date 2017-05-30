import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';

import Location from './components/Location';
import services from './services';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class App extends React.Component {
  state = {
    appIsReady: false
  }

  componentWillMount() {
    this.bootstrap();
  }

  bootstrap = async () => {
    await services.init();
    console.log('services initialized');
    this.setState({ appIsReady: true });
  };

  render() {
    if (!this.state.appIsReady) {
      return <AppLoading />;
    }

    return (
      <View style={styles.container}>
        <Location />
      </View>
    );
  }
}

export default App;
