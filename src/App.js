/* global google */

import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, Polygon } from 'react-leaflet';
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
      markers: [],
      tracts: [{positions: [[41.467714, -81.759736], [41.467195, -81.758724], [41.465218, -81.758711], [41.465238, -81.758649], [41.466693, -81.754202], [41.467728, -81.751035], [41.468388, -81.749038], [41.468464, -81.748835], [41.469226, -81.746722], [41.47009, -81.745592], [41.470056, -81.751034], [41.47046, -81.748568], [41.472142, -81.748559], [41.473252, -81.748558], [41.477114, -81.748543], [41.477103, -81.750968], [41.477066, -81.754133], [41.47043, -81.754186], [41.470107, -81.75286], [41.469819, -81.752498], [41.46878, -81.755502], [41.467997, -81.758053], [41.467714, -81.759736]],
      key: 0}]
    }
  }

  addMarker(data) {
    var oldMarkers = this.state.markers
    if(oldMarkers.length==0) {
      data.latlng.key = 0;
    } else {
      data.latlng.key = oldMarkers[oldMarkers.length-1].key+1;
    }
    oldMarkers.push(data.latlng)
    this.setState({markers: oldMarkers})
    console.log(this.state);
  }

  deleteMarker(marker) {
    const newMarkers = this.state.markers;
    if (newMarkers.indexOf(marker) > -1) {
      newMarkers.splice(newMarkers.indexOf(marker), 1);
      this.setState({markers: newMarkers})
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
    const mapboxURL = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}@2x?access_token=' + MAPBOX_KEY
    const Markers = this.state.markers.map(marker => (
      <Marker position={[marker.lat, marker.lng]} key = {marker.key}>
        <Popup>
          <button onClick={this.deleteMarker.bind(this, marker)} type="button">Delete!</button>
        </Popup>
      </Marker>
    ));
    const Tracts = this.state.tracts.map(tract => (
      <Polygon positions={tract.positions} key={tract.key}>
        <Popup>
          <span>I AM A TRACT!</span>
        </Popup>
      </Polygon>
    ));
    return (
      <div className="app-root">
        <Map className="map" onClick={this.addMarker.bind(this)} center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={mapboxURL}
          />
          <Marker position={position}>
            <Popup>
              <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
            </Popup>
          </Marker>
          {Markers}
          {Tracts}
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
