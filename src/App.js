/* global google */

import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { MAPBOX_KEY } from "./mapboxkey.js";
import '../css/App.css';
import Geosuggest from 'react-geosuggest';

class App extends Component {
  constructor() {
    super();
    this.state = {
      lat: 41.498545,
      lng: -81.689281,
      zoom: 13,
    }
  }

  onSuggestSelect(suggest) {
    console.log(suggest);
    this.setState({
      lat: suggest.location.lat,
      lng: suggest.location.lng,
      zoom: 16
    });
  }

  render () {
    console.log(MAPBOX_KEY)
    const position = [this.state.lat, this.state.lng]
    const mapboxURL = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}@2x?access_token=' + MAPBOX_KEY
    return (
      <div className="app-root">
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={mapboxURL}
          />
          <Marker position={position}>
            <Popup>
              <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
            </Popup>
          </Marker>
        </Map>
        <div className="panels">
          <Geosuggest
            onSuggestSelect={this.onSuggestSelect.bind(this)}
            location={new google.maps.LatLng(41.498321, -81.696316)}
            radius="20"
          />
        </div>
      </div>
    )
  }
}

export default App;
