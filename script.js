var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var pointsArray = [];
var legs;
var durationArray = [];

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  var mapOptions = {
    zoom:10,
    center: chicago
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);
}

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      pointsArray = [];
      pointsArray = response.routes[0].overview_path;
      durationArray = [];
      leg = response.routes[0].legs;
      for (var x=0; x<leg.length;x++){
        durationArray[x] = response.routes[0].legs[x].duration.value;
      }
      
/*    var point1 = new google.maps.Marker ({
        position:pointsArray[2],
        draggable:true,
        map:map,
        flat:true
        });
*/
      displayAlert(pointsArray + " " + durationArray +  "  " + pointsArray.length); //gets all lat, long leg points out of the function
    }
  });

}
function displayAlert(text){
  console.log(text);
}
function getWeather(latLongArray,timeArray){

}

google.maps.event.addDomListener(window, 'load', initialize);