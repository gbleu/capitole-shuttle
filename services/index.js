import geolib from 'geolib';

import conf from '../conf';

class Services {
  init = () => Promise.resolve;

  guessOrigin = (location) => {
    const res = geolib.findNearest(location, conf.spots);
    return res;
  }

  getNextDepartures = (origin) => {
    const departures = conf.spots[origin].departures;

    const now = new Date();
    const time = new Date(0, 0, 0, now.getHours(), now.getMinutes());
    const nextDepartureIndex = departures.findIndex(it => it > time);

    let res;
    if (nextDepartureIndex === 0) {
      res = [ null, ...departures.slice(0, 2) ];
    } else if (nextDepartureIndex === departures.length) {
      res = [ ...departures.slice(nextDepartureIndex - 1), null ];
    } else {
      res = departures.slice(nextDepartureIndex - 1, nextDepartureIndex + 2);
    }
    return res;
  };

  trafficBetween = async (from, to) => {
    const url = `${conf.maps.url}?origins=place_id:${from.placeId}&destinations=place_id:${to.placeId}&departure_time=now&traffic_model=pessimistic&key=${conf.maps.key}`;
    console.log(`fetch ${url}`);
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);

    const elt = json.rows[0].elements[0];
    const duration = elt.duration.value;
    const traffic = elt.duration_in_traffic.value;

    return duration && traffic && Math.round(((traffic - duration) / 60));
  };

  trafficFrom = async (origin) => {
    if (origin === 'defense') {
      return this.trafficBetween(conf.spots.defense, conf.spots.capitole);
    }
    return this.trafficBetween(conf.spots.capitole, conf.spots.defense);
  }

  trafficTo = async (destination) => {
    if (destination === 'defense') {
      return this.trafficBetween(conf.spots.capitole, conf.spots.defense);
    }
    return this.trafficBetween(conf.spots.defense, conf.spots.capitole);
  }
}

export default new Services();
