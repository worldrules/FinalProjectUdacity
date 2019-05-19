import React, {Component} from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {

  state = {
    venues: []
  }

  componentDidMount(){
    this.getVenues()
    
  }

 
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBoMIV0qGMqy3MSO8ZfWIPWHXB_LTOlr_s&callback=initMap")
    window.initMap = this.initMap
  }
  
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "YTPGPCJ43XICTGC4BQCRGQHRHSDU0VJ2PHGDSZO5WLHUFTOE",
      client_secret: "BIFOPCDP1DWJE3K2FXF1HA2SNHJZJLZDV0XNWYGW5DDU5GFD",
      query: "food",
      near: "Sydney",
      v: "20182507"
    } 

    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
      this.setState({
        venues: response.data.response.groups[0].items
      },this.renderMap())
      console.log();
    }).catch(e => {
      console.log(`Error !!! ${e}`);                                                                  
    })
  }
  
  
  
  // Create a Map
  initMap = () => {
    // Create a Map
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
    

    var infowindow = new window.google.maps.InfoWindow()

    //Display Dynamic Markers
    this.state.venues.map(myVenue =>{     
      var contentString = `${myVenue.venue.name}`

      // Create a Marker
      var marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
        map: map,
        title: myVenue.venue.name
      });

      // Click on a mark !
      marker.addListener('click', function() {

        // Change the content
        infowindow.setContent(contentString)


        // Open a InfoWindow
        infowindow.open(map, marker);
      });
    })

  
  }

  

  render() {
    return (
      <main>
        <div id="map"></div>
      </main>
    )
  }
} //end component app


function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)

}

export default App;