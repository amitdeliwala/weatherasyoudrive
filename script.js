var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var pointsArray = [];
var step;
var durationArray = [];
var unix = Math.round(+new Date()/1000);
var url = "https://api.forecast.io/forecast/6e1a4647efbd8072681ab889900daa60/";
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
      durationArray = [];
      step = response.routes[0].legs[0].steps;   //array of steps info
      stepParse(step);
      //displayAlert(pointsArray.length + "   " + step.length);
      
/*    var point1 = new google.maps.Marker ({
        position:pointsArray[2],
        draggable:true,
        map:map,
        flat:true
        });
*/
    }
  });

}
function displayAlert(text){
  console.log(text);
}
function stepParse(stepArray){
  var timeSum = 0;
  for (x=0;x<step.length; x++){
    durationArray[x]=step[x].duration.value;  //iterate through steps array
  }
  for(x=0;x<durationArray.length;x++){
    timeSum += durationArray[x];
    if (timeSum % 3600 > 0){
      getWeather(x,timeSum);
      displayAlert("Over an hour has elapsed");
      timeSum -= 3600;
    }
    else if ((timeSum % 3600 != 1) && (x == durationArray.length - 1)){
      displayAlert("Less than an hour");
      getWeather(x,timeSum);
      
    }
  }

}
function getWeather(locArray,time){
  var location = step[locArray].end_location;
  var latitude = location.lat();
  var longitude = location.lng();
  time = time % 3600;
  time += unix;

  displayAlert(latitude + "," + longitude + " " + time);
  //create url for forecast
  url=url + latitude + "," + longitude + "," + time + "?callback=?";
  displayAlert(url);
  //go to JSONQuery function for query code
  var weatherdata = JSON.parse(JSONQuery(url));
  //send to displayWeather parsing and display
  displayWeather(weatherdata);
}
function JSONQuery(JSONurl){
  var data;
  $.getJSON(url, function(data) {
    //console.log(data);
    displayWeather(data);  
  });
}
function displayWeather(weatherdata){
  var text = weatherdata.currently.temperature;
  displayAlert(text);
  //create a circle with the temperature inside on location
  var latnlng = new google.maps.LatLng(weatherdata.latitude, weatherdata.longitude);
  //chooseIcon(weatherdata);
  var image = 'images/sunny test.png';
  var contentString = (text + " degrees Farenheit");
  //create the infowindow
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  //create the marker which will have icon for what type of weather 
  var tempMarker = new google.maps.Marker({
    text: text,
    position: latnlng,
    map: map,
    icon: image
  });
  //listener for if marker gets clicked
  google.maps.event.addListener(tempMarker, 'click', function() {
    infowindow.open(map,tempMarker);
  });
  //open by default
  infowindow.open(map,tempMarker);
}
function chooseIcon(weatherdata){
  //create array with icon data and choose based on weather data.
}
google.maps.event.addDomListener(window, 'load', initialize);