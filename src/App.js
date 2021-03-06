/* global google */

import React, { Component } from 'react';
import Select from 'react-select';
import { Map, Marker, Popup, TileLayer, Polygon } from 'react-leaflet';
import { BACKEND_IP, CLICKY_KEY, GOOGLE_KEY, MAPBOX_KEY } from "./config.js";
import '../css/App.css';
import Geosuggest from 'react-geosuggest';

import magnification from '../assets/Magnification.png';
import pin from '../assets/Pin.svg';
import connectivity from '../assets/Connectivity.png';
import education from '../assets/Education.png';
import transportation from '../assets/Transportation.png';
import wellness from '../assets/Wellness.png';

import 'react-select/dist/react-select.css';

const options = [
  { value: 'cmha', label: 'CMHA' },
  { value: 'autoencoder', label: 'AutoEncoder' }
];

class App extends Component {
  constructor() {
    super();
    this.state = {
      lat: 41.498545,
      lng: -81.689281,
      zoom: 13,
      markers: [],
      tracts: [],
      selectValue: 'cmha',
    }
  }

  zoomToCoordinates(lat, lng) {
    this.setState({
      lat: lat,
      lng: lng,
      zoom: 14
    });
  }

  fetchResultsForMarkers(operation, changedMarker, markers, rankingMethod) {
    fetch(`http://${BACKEND_IP}:5000/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({operation: operation,
                            changedMarker: changedMarker,
                            markers: markers,
                            rankingMethod: rankingMethod
                          })
    }).then(response => response.json())
      .then((responseJson) => {
        this.setState({tracts:responseJson});
      });
  }

  addMarker(data) {
    var oldMarkers = this.state.markers
    if(oldMarkers.length===0) {
      data.latlng.key = 0;
    } else {
      data.latlng.key = oldMarkers[oldMarkers.length-1].key+1;
    }
    this.context.mixpanel.track('Marker Added', {
      'latitude': data.latlng.lat,
      'longitude': data.latlng.lng,
    });
    oldMarkers.push(data.latlng)
    this.setState({markers: oldMarkers})
    this.fetchResultsForMarkers("add", data.latlng, this.state.markers, this.state.selectValue)
  }

  deleteMarker(marker) {
    const newMarkers = this.state.markers;
    this.context.mixpanel.track('Marker Deleted', {
      'latitude': marker.lat,
      'longitude': marker.lng,
    });
    if (newMarkers.indexOf(marker) > -1) {
      newMarkers.splice(newMarkers.indexOf(marker), 1);
      this.setState({markers: newMarkers})
    }
    this.fetchResultsForMarkers("remove", marker, this.state.markers, this.state.selectValue)
  }

  onSuggestSelect(suggest) {
    const data = {
      latlng: {
        lat: suggest.location.lat,
        lng: suggest.location.lng
      }
    }
    this.context.mixpanel.track('Suggestion Accepted', {
      'label': suggest.description,
    });
    this.addMarker(data);
    this.zoomToCoordinates(suggest.location.lat, suggest.location.lng)
  }

  updateRanking (newValue) {
		this.setState({
			selectValue: newValue.value
		});
    this.fetchResultsForMarkers("ranking", null, this.state.markers, newValue.value)
	}

  getSuggestLabel(suggest) {
    const mainText = suggest.structured_formatting.main_text;
    const secondaryText = suggest.structured_formatting.secondary_text;
    if (!suggest.matched_substrings) {
      return (
        <div className="search-item">
          <span className="main-text">{mainText}</span>
          <span className="secondary-text">{secondaryText}</span>
        </div>
      );
    }

    const start = suggest.matched_substrings[0].offset,
          length = suggest.matched_substrings[0].length,
          end = start + length,
          boldPart = mainText.substring(start, end);

    let pre = '', post = '';

    if (start > 0) {
      pre = mainText.slice(0, start);
    }
    if (end < mainText.length) {
      post = mainText.slice(end);
    }

    return (
      <div className="search-item">
        <div className="icon-container pin">
          <img alt="Pin" rc={pin}/>
        </div>
        <span className="main-text">
          {pre}
          <b className='geosuggest__item__matched-text' key={mainText}>
            {boldPart}
          </b>
          {post}
        </span>
        <span className="secondary-text">{secondaryText}</span>
      </div>
    );
  }

  render () {
    const position = [this.state.lat, this.state.lng]
    const mapboxURL = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}@2x?access_token=' + MAPBOX_KEY
    const Markers = this.state.markers.map(marker => (
      <Marker position={[marker.lat, marker.lng]} key={marker.key}>
        <Popup>
          <button onClick={this.deleteMarker.bind(this, marker)} type="button">Delete</button>
        </Popup>
      </Marker>
    ));
    const Tracts = this.state.tracts.map((tract, index) => (
      <Polygon positions={JSON.parse(tract.tract.bounding_rect)}
               key={index}
               onClick={() => {
                   this.context.mixpanel.track('Polygon Clicked', {
                     'tract_id': tract.tract.tract_id,
                   });
                 }
               }>
        <Popup>
          <span>{tract.tract.name}</span>
        </Popup>
      </Polygon>
    ));
    return (
      <div className="app-root">
        <script src="//static.getclicky.com/js" type="text/javascript"></script>
        <script type="text/javascript">clicky.init({CLICKY_KEY}});</script>
        <noscript><p><img alt="Clicky" width="1" height="1" src={"//in.getclicky.com/" + CLICKY_KEY + "ns.gif"} /></p></noscript>
        <Map className="map" onClick={this.addMarker.bind(this)} center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={mapboxURL}
          />
          {Markers}
          {Tracts}
        </Map>
        <div className="panels">
          <SearchBox onSuggestSelect={this.onSuggestSelect.bind(this)} getSuggestLabel={this.getSuggestLabel}/>
          <ResultsBox tracts={this.state.tracts} zoomer={this.zoomToCoordinates.bind(this)}/>
          <Select
            name="select-similarity"
            value={this.state.selectValue}
            options={options}
            onChange={this.updateRanking.bind(this)}
          />
        </div>
      </div>
    )
  }
}
App.contextTypes = {
    mixpanel: React.PropTypes.object.isRequired
};

class SearchBox extends Component {
  render() {
    return (
      <div className="search">
        <div className="icon-container magnify">
          <img alt="Magnify" src={magnification}/>
        </div>
        <Geosuggest
          highlightMatch={false}
          onSuggestSelect={this.props.onSuggestSelect}
          getSuggestLabel={this.props.getSuggestLabel}
          placeholder="What areas do you like?"
          location={new google.maps.LatLng(41.498321, -81.696316)}
          radius="20"
        />
      </div>
    )
  }
}

class Result extends Component {
  constructor() {
    super();
    this.state = {
      name: ''
    }
  }

  scoreToRating(score) {
    var range = Math.floor(Number(score) / 100)
    if (range === 0) {
      return 'Great'
    }
    else if (range === 1) {
      return 'Good'
    }
    else if (range === 2) {
      return 'Ok'
    }
    else {
      return 'Low'
    }
  }

  render() {
    return (
      <div className="result" onClick={()=>{
        this.props.zoomer(this.props.center_lat, this.props.center_lng);
        this.context.mixpanel.track('Result Clicked', {
          'tract_id': this.props.tract_id,
        });
      } }>
        <img className="big-picture" width='80' height='59' alt="Neighborhood" src={this.props.img_src}/>
        <div className="description">
          <div className="tract-name">{this.props.name}</div>
          <div className="stats">
            <div className="stat">
              <div className="icon">
                <img className="icon-image" alt="Transportation" src={transportation}/>
              </div>
              <div className="ranking">
                {this.scoreToRating(this.props.transportation)}
              </div>
            </div>
            <div className="stat">
              <div className="icon">
                <img className="icon-image" alt="Education" src={education}/>
              </div>
              <div className="ranking">
                {this.scoreToRating(this.props.education)}
              </div>
            </div>
            <div className="stat">
              <div className="icon">
                <img className="icon-image" alt="Wellness" src={wellness}/>
              </div>
              <div className="ranking">
                {this.scoreToRating(this.props.wellness)}
              </div>
            </div>
            <div className="stat">
              <div className="icon">
                <img className="icon-image" alt="Connectivity" src={connectivity}/>
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
Result.contextTypes = {
    mixpanel: React.PropTypes.object.isRequired
};

class ResultsBox extends Component {
  render() {
    const Results = this.props.tracts.map((tract, index) => (
      <Result
        name={tract.tract.name}
        tract_id={tract.tract.tract_id}
        key={index}
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
