/* global google */

import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, Polygon } from 'react-leaflet';
import { MAPBOX_KEY } from "./mapboxkey.js";
import '../css/App.css';
import Geosuggest from 'react-geosuggest';

import magnification from '../assets/Magnification.png';

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
    const position = [this.state.lat, this.state.lng]
    const positions = [[41.467714, -81.759736], [41.467195, -81.758724], [41.465218, -81.758711], [41.465238, -81.758649], [41.466693, -81.754202], [41.467728, -81.751035], [41.468388, -81.749038], [41.468464, -81.748835], [41.469226, -81.746722], [41.47009, -81.745592], [41.470056, -81.751034], [41.47046, -81.748568], [41.472142, -81.748559], [41.473252, -81.748558], [41.477114, -81.748543], [41.477103, -81.750968], [41.477066, -81.754133], [41.47043, -81.754186], [41.470107, -81.75286], [41.469819, -81.752498], [41.46878, -81.755502], [41.467997, -81.758053], [41.467714, -81.759736]]
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
          <Polygon positions={positions}>
            <Popup>
              <span>I am a tract! Check my sexy body out!</span>
            </Popup>
          </Polygon>
        </Map>
        <div className="panels">
          <SearchBox onSuggestSelect={this.onSuggestSelect.bind(this)}/>
        </div>
      </div>
    )
  }
}

class SearchBox extends Component {
  render() {
    return (
      <div className="search">
        <div className="icon-container">
          <img src={magnification}/>
        </div>
        <Geosuggest
          onSuggestSelect={this.props.onSuggestSelect}
          placeholder="What areas do you like?"
          location={new google.maps.LatLng(41.498321, -81.696316)}
          radius="20"
        />
      </div>
    )
  }
}

export default App;
