import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import logo from './logo.svg';
import MAPBOX_KEY from "../mapboxkey.js"
import './App.css';

class App extends Component {
  state = {
    lat: 41.487007,
    lng: -81.504302,
    zoom: 13,
  }

/*
url='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
maxZoom: 18
id: 'mapbox/streets-v10/tiles/256'
accessToken: MAPBOX_KEY
*/


  render () {
    const position = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    )
  }
}

export default App;
