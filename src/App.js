/* global google */

import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, Polygon } from 'react-leaflet';
import { MAPBOX_KEY } from "./mapboxkey.js";
import '../css/App.css';
import Geosuggest from 'react-geosuggest';

import magnification from '../assets/Magnification.png';
import connectivity from '../assets/Connectivity.png';
import education from '../assets/Education.png';
import transportation from '../assets/Transportation.png';
import wellness from '../assets/Wellness.png';

class App extends Component {
  constructor() {
    super();
    this.state = {
      lat: 41.498545,
      lng: -81.689281,
      zoom: 13,
      markers: [],
      tracts: [
        // {'tract' : {
        //     'name': 'Tract 1',
        //     'center_lat': '41.471166',
        //     'center_lng': '-81.75266400000001',
        //     'bounding_rect': [[41.467714, -81.759736], [41.467195, -81.758724], [41.465218, -81.758711], [41.465238, -81.758649], [41.466693, -81.754202], [41.467728, -81.751035], [41.468388, -81.749038], [41.468464, -81.748835], [41.469226, -81.746722], [41.47009, -81.745592], [41.470056, -81.751034], [41.47046, -81.748568], [41.472142, -81.748559], [41.473252, -81.748558], [41.477114, -81.748543], [41.477103, -81.750968], [41.477066, -81.754133], [41.47043, -81.754186], [41.470107, -81.75286], [41.469819, -81.752498], [41.46878, -81.755502], [41.467997, -81.758053], [41.467714, -81.759736]],
        //     'img_src': 'https://s-media-cache-ak0.pinimg.com/736x/73/de/32/73de32f9e5a0db66ec7805bb7cb3f807.jpg',
        //     'education_rank': '42',
        //     'transportation_rank': '195',
        //     'wellness_rank': '220',
        //     'connectivity_rank': '421',
        //   }
        // }
      ]
    }
  }

  zoomToCoordinates(lat, lng) {
    this.setState({
      lat: lat,
      lng: lng,
      zoom: 14
    });
  }

  addMarker(data) {
    console.log(data);
    var oldMarkers = this.state.markers
    if(oldMarkers.length==0) {
      data.latlng.key = 0;
    } else {
      data.latlng.key = oldMarkers[oldMarkers.length-1].key+1;
    }
    oldMarkers.push(data.latlng)
    this.setState({markers: oldMarkers})
    fetch(`http://127.0.0.1:5000/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.markers)
    }).then(response => response.json())
      .then((responseJson) => {
        this.setState({tracts:responseJson});
      });
  }

  deleteMarker(marker) {
    const newMarkers = this.state.markers;
    if (newMarkers.indexOf(marker) > -1) {
      newMarkers.splice(newMarkers.indexOf(marker), 1);
      this.setState({markers: newMarkers})
    }
  }

  onSuggestSelect(suggest) {
    const data = {
      latlng: {
        lat: suggest.location.lat,
        lng: suggest.location.lng
      }
    }
    this.addMarker(data);
    this.zoomToCoordinates(suggest.location.lat, suggest.location.lng)
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
      <Polygon positions={JSON.parse(tract.tract.bounding_rect)} key={tract.tract.name}>
        <Popup>
          <span>{tract.tract.name}</span>
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
          {Markers}
          {Tracts}
        </Map>
        <div className="panels">
          <SearchBox onSuggestSelect={this.onSuggestSelect.bind(this)}/>
          <ResultsBox tracts={this.state.tracts} zoomer= {this.zoomToCoordinates.bind(this)}/>
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

class Result extends Component {
  scoreToRating(score) {
    var range = Math.floor(Number(score) / 100)
    if (range == 0) {
      return 'Great'
    }
    else if (range == 1) {
      return 'Good'
    }
    else if (range == 2) {
      return 'Fair'
    }
    else {
      return 'Poor'
    }
  }

  render() {
    return (
      <div className="result" onClick={this.props.zoomer.bind(this, this.props.center_lat, this.props.center_lng)}>
        <img className="big-picture" width='80' height='59' src={this.props.img_src}/>
        <div className="description">
          <div className="tract-name">{this.props.name}</div>
          <div className="stats">
            <div className="stat">
              <div className="icon">
                <img className="icon-image" src={transportation}/>
              </div>
              <div className="ranking">
                {this.scoreToRating(this.props.transportation)}
              </div>
            </div>
            <div className="stat">
              <div className="icon">
                <img className="icon-image" src={education}/>
              </div>
              <div className="ranking">
                {this.scoreToRating(this.props.education)}
              </div>
            </div>
            <div className="stat">
              <div className="icon">
                <img className="icon-image" src={wellness}/>
              </div>
              <div className="ranking">
                {this.scoreToRating(this.props.wellness)}
              </div>
            </div>
            <div className="stat">
              <div className="icon">
                <img className="icon-image" src={connectivity}/>
              </div>
              <div className="ranking">
                {this.scoreToRating(this.props.connectivity)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class ResultsBox extends Component {
  render() {
    const Results = this.props.tracts.map(tract => (
      <Result
        name={tract.tract.name}
        center_lat={tract.tract.center_lat}
        center_lng={tract.tract.center_lng}
        img_src={tract.tract.img_src}
        transportation={tract.tract.transportation_rank}
        education={tract.tract.education_rank}
        wellness={tract.tract.wellness_rank}
        connectivity={tract.tract.connectivity_rank}
        zoomer={this.props.zoomer}/>
    ));
    if (this.props.tracts.length <= 0) {
      return (<div></div>);
    }
    return (
      <div className="results-box">
        <div className="title">
          Our Recommendations
        </div>
        <div className="results">
          {Results}
        </div>
      </div>
    );
  }
}


export default App;
