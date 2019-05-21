import React, {Component} from 'react';
import './App.css';
import axios from 'axios'
import MenuComponent from './MenuComponent'
import ErrorBoundary from './ErrorBoundary'
import SearchBar from './SearchBar'
import escapeRegExp from 'escape-string-regexp'
import Header from './Header'

class App extends Component {

  constructor(props) {
  super(props)
  this.state = {
    venues: [],
    markers: [],
    showVenues: [],
    query: '',
    notVisibleMarkers:[]
  }}

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
      query: "coffe",
      near: "Porto Alegre",
      v: "20182507"
    } 

    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
      this.setState({
        venues: response.data.response.groups[0].items,
        showVenues: response.data.response.groups[0].items
      },this.renderMap())
      console.log();
    }).catch(e => {
      console.log(`Error !!! ${e}`);                                                                  
      alert(`Ocorreu um erro na requisição da API ${e}`);                                                                  
    })
  }
  
  
  
  // Create a Map
  initMap = () => {
    // Create a Map
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -30.0277, lng: -51.2287},
      zoom: 8
    });
    

    var infowindow = new window.google.maps.InfoWindow({
      maxWidth: 180
    })
    this.infowindow = infowindow

    //Display Dynamic Markers
    this.state.venues.map(myVenue =>{     
      var contentString = `<b>${myVenue.venue.name}</b> <br><i>${myVenue.venue.location.address}</i>
      <br><br><i>Info by Foursquare.</i>`
      

      // Create a Marker
      const marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: myVenue.venue.name
      });

      this.state.markers.push(marker)



      function animationEffect() {
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
        setTimeout(function(){ marker.setAnimation(null) }, 600)
      }

      function openMarker() {
        // Setting the content of the InfoWindow
        infowindow.setContent(contentString)
        animationEffect()
        
      // Open an InfoWindow upon clicking on its marker
        infowindow.open(map, marker)
      }


      // Click on a mark !
      marker.addListener('click', function() {

        openMarker();

        // Change the content
        infowindow.setContent(contentString)


        // Open a InfoWindow
        infowindow.open(map, marker);
      });
    })

  
  } // End Init Map

  /*
   * Handling the query update i.e. when the user uses the filter option 
  */
 updateQuery = query => {
  this.setState({ query })
  this.state.markers.map(marker => marker.setVisible(true))
  let filterVenues
  let notVisibleMarkers

  if (query) {
    const match = new RegExp(escapeRegExp(query), "i")
    filterVenues = this.state.venues.filter(myVenue =>
      match.test(myVenue.venue.name)
    )
    this.setState({ venues: filterVenues })
    notVisibleMarkers = this.state.markers.filter(marker =>
      filterVenues.every(myVenue => myVenue.venue.name !== marker.title)
    )

    /* 
     * Hiding the markers for venues not included in the filtered venues
    */
    notVisibleMarkers.forEach(marker => marker.setVisible(false))

    this.setState({ notVisibleMarkers })
  } else {
    this.setState({ venues: this.state.showVenues })
    this.state.markers.forEach(marker => marker.setVisible(true))
  }
}



  

  render() {
    if (this.state.hasError) {
      return <div id="Error-message" aria-label="Error message">Sorry, something went wrong!</div>
    } else {


    return (
      <main>
        <ErrorBoundary>
        <div id="header" aria-label="Header">
          <Header />
        </div>

        <div id="SearchBar" aria-label="Search Bar">
          <SearchBar
          venues = {this.state.showVenues}
          markers = {this.state.markers}
          filteredVenues = {this.filteredVenues}
          query = {this.state.query}
          clearQuery = {this.clearQuery}
          updateQuery = {b => this.updateQuery(b)}
          clickLocation = {this.clickLocation}
          />
        </div>

        <div id="container" aria-label="Menu Container">
          <MenuComponent
            venues = {this.state.venues}
            markers = {this.state.markers}
          />
        </div>

        <div id="map" aria-label="Map" role="application">
        </div>

        </ErrorBoundary>

      </main>
    )
  }
}

} //end component app


// Load Google Maps
function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  script.onerror = function () {  
    document.write("Google Maps não conseguiu carregar !!")
  };
  index.parentNode.insertBefore(script, index)

}

export default App;