import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import logo from './logo.svg';
import { MAPBOX_KEY } from "./mapboxkey.js"
import './App.css';

class App extends Component {

  state = {
    lat: 41.498545,
    lng: -81.689281,
    zoom: 13,
  }

  render () {
    console.log(MAPBOX_KEY)
    const position = [this.state.lat, this.state.lng]
    const mapboxURL = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}@2x?access_token=' + MAPBOX_KEY
    return (
      <Map center={position} zoom={this.state.zoom}>
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
    )
  }
/*

https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1IjoiZ2NjYWxkd2VsbCIsImEiOiJjajE4YzkyZ2kwNm93MzJvN2Rqa3M2djB6In0.ld3nbtPiF2xzW863YOt2QQ

url='https://api.tiles.mapbox.com/v4/mapbox/streets-v10/tiles/256/{z}/{x}/{y}.png?access_token=' + MAPBOX_KEY
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
maxZoom: 18
id: 'mapbox/streets-v10/tiles/256'
accessToken: MAPBOX_KEY
*/
}

export default App;
