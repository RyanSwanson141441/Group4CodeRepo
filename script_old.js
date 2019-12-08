var map, service, infoWindow;
var request;



function preferences(json_data){
    data = JSON.parse(json_data);
    // Defining all variables for the uesr preferences
    var groupSize = parseInt(document.getElementById('groupSize').value, 10); //
    var estimateCost = document.getElementById('estimateCost').value; // 0 - $, 1 - $$, 2 - $$$
    var age = document.getElementById('age').value; // 0 - under 21, 1 - over 21
    var outdoor = document.getElementById('activity').value; //0 - Indoor, 1 - Outdoor
    var drink = document.getElementById('liquor').value; // 0 - no drinking, 1 - drinking
    //checks each event and will add it to matches[] if it meets 5 or more preferences
  	for(i = 0; i < data.length; i++){
      var prefMatch = 0;
      //event has to be within the user's group size range
      if((data[i].mingroupsize <= groupSize) && (groupSize <= data[i].maxgroupsize)){
         prefMatch++;
      }
      if(data[i].estimate_cost == estimateCost){
         prefMatch++;
      }
      if((age >= 21 && data[i].drinks == 1) || ((age < 21 && data[i].drinks == 0))){
         prefMatch++;
      }
      if(data[i].activitytype == outdoor){
         prefMatch++;
      }
      if(data[i].drinks == drink){
         prefMatch++;
      }
      if(prefMatch >= 4){
        request.push({query: data[i].location_name, fields: ['place_id']});
      }
		}
    console.log(request);
}
​
function createMap () {
​
    var options = {
        center: {lat: 40.014984, lng: -105.270546},
        zoom: 15,
    };
​
    infoWindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById('map'), options);
    service = new google.maps.places.PlacesService(map);
​
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function (p) {
            var position = {
                lat: p.coords.latitude,
                lng: p.coords.longitude
            };
            infoWindow.setPosition(position);
            infoWindow.setContent('Your Location');
            infoWindow.open(map);
        }, function () {
            handleLocationError('Geolocation Service Failed.', map.center());
        })

    } else {
        handleLocationError('No Geolocation Available', map.center());
    }
​
​
    // var request =
    // [
    //     {query: "The Sink", fields: ['place_id']},
    //     {query: "Cosmo's Pizza", fields: ['place_id']},
    //     {query: "Wapos", fields: ['place_id']},
    //     {query: "South Mouth", fields: ['place_id']},
    //     {query: "Tiffins", fields: ['place_id']},
    //     {query: "Five Spice", fields: ['place_id']},
    //     {query: "Boulder Pho", fields: ['place_id']},
    //     {query: "Red Rocks Amphitheatre", fields: ['place_id']},
    //     {query: "The Fox Theatre", fields: ['place_id']},
    //     {query: "The Black Box", fields: ['place_id']},
    //     {query: "First  Bank Center", fields: ['place_id']},
    //     {query: "Mission Ballroom", fields: ['place_id']},
    //     {query: "Cheba Hut", fields: ['place_id']},
    //     {query: "Walgreens", fields: ['place_id']}, // missing
    //     {query: "Cervantes", fields: ['place_id']},
    //     {query: "Safeway", fields: ['place_id']},
    //     {query: "Mattress Firm", fields: ['place_id']}, // missing
    //     {query: "Lolita's", fields: ['place_id']},
    //     {query: "Norlin Library", fields: ['place_id']},
    //     {query: "The Fitter", fields: ['place_id']}, // missing
    //     {query: "Up N Smoke", fields: ['place_id']},
    //     {query: "Boulder Orthodontics", fields: ['place_id']},
    //     {query: "The Dandelion", fields: ['place_id']},
    //     {query: "Native Roots", fields: ['place_id']},
    //     {query: "14er", fields: ['place_id']},
    //     {query: "Deviant Distillery", fields: ['place_id']}
    // ];
​
    console.log(request);
    for (var j = 0; j < request.length; j++) {
        service.findPlaceFromQuery(request[j], function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                sleep(500);
                for (var i = 0; i < results.length; i++) {
                    result = results[i];
                    var placeIDRequest = {
                        placeId: result['place_id'],
                        fields: ['name','opening_hours', 'geometry','rating','price_level','formatted_address','website','review','photos','icon'],
                    }
                    service.getDetails(placeIDRequest,  function callback(place,status)
                    {
                        if (status === google.maps.places.PlacesServiceStatus.OK)
                        {
                            console.log(place)
                            createMarker(place);
                        }
                        else
                        {
                            console.log('This Shit Broke');
                        }
                    });
                }
            }
            else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT)
            {
                sleep(5000);
                console.log('BROKEN BRUH');
            }
        });
    }
}
​
function sleep(miliseconds)
{
   var currentTime = new Date().getTime();
   while (currentTime + miliseconds >= new Date().getTime()){
   }
}
​
function createMarker(place) {
    var formattedIcon = {
        url: place.icon,
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var marker = new google.maps.Marker
    ({
        map: map,
        position: place.geometry.location,
        title: place.name,
        icon: formattedIcon
    });
    google.maps.event.addListener(marker, 'click', function() {
        var test =
            '<h3>' + place.name + '</h3>'+
            '<img src =' + place.photos[1].getUrl() + ' class = "img-rounded" alt = "this is a test" width = "150" height = "100" >'+
            '<img src =' + place.photos[2].getUrl() + ' class = "img-rounded" alt = "this is a test" width = "150" height = "100" >'+
            '<img src =' + place.photos[3].getUrl() + ' class = "img-rounded" alt = "this is a test" width = "150" height = "100" >'+
            '<br><br><br>'+
            '<ul>'+
                '<li> <b> Price: </b> '+ price(place.price_level) +'</li>'+
                '<li> <b> Address: </b>'+ place.formatted_address +'</li>'+
                '<li> <b> Rating: </b>' + place.rating + '</li>'+
            '</ul>'+
            '<h5> <b> Recent Reviews: </b> </h5>' +
            '<ul>'+
                '<li>'  + place.reviews[1].text + '</li>'+
                '<li>'  + place.reviews[2].text + '</li>'+
                '<li>'  + place.reviews[3].text + '</li>'+
            '</ul>'+
            '<p> <b>Hours: </b> ' + place.opening_hours.weekday_text + '</p>'+
            '<a target = "_blank" href = ' + place.website + '> <button  class = "btn btn-primary">Click To Visit Their Website</button></a>';
        infoWindow.setContent(test);
        infoWindow.open(map, this);
    });
}
​
function price(price_amt)
{
    if (price_amt == 0)
    {
        return '0'
    }
    else if (price_amt == 1) {
        return '$'
    }
    else if (price_amt == 2) {
        return '$$'
    }
    else if (price_amt == 3) {
        return '$$$'
    }
    else if (price_amt == 4) {
        return '$$$$'
    }
    else
    {
        return 'Not Available'
    }
}
​
function handleLocationError (content, position){
    infoWindow.setPosition(position);
    infoWindow.setContent(content);
    infoWindow.Open(map);
}
​
​


​
​
​
​
​
​
​
​
​
​
​
​
​
​
​
​
​
// service.getDetails(details, function(results, status) {
    //     if (status === google.maps.places.PlacesServiceStatus.OK) {
    //         for (var i = 0; i < results.length; i++) {
    //             createMarker(results[i]);
    //         }
    //     }
    // });
​
    // function placeMarker(loc) {
    //     const marker = new google.maps.Marker({
    //         position: new google.maps.LatLng(loc.lat, loc.lng),
    //         map: map
    //     });
    //     google.maps.event.addListener(marker, 'click', function(){
    //         marker.loc = loc;
    //         infoWindow.close();
    //         infoWindow.open(map,marker);
    //     });
    // }
​
    // locations.forEach (placeMarker);
​
​
    // var sinkCoords = {lat: 40.014984, lng: -105.270546}
    // var sinkString = '<p>'+'TESTING'+'</p>';
    // var sinkwindow = new google.maps.InfoWindow({
    //     content: sinkString
    // });
    // var sinkmarker = new google.maps.Marker({
    //     position: sinkCoords,
    //     map: map,
    //     title: 'The Sink'
    // });
    // sinkmarker.addListener('click', function() {
    //     sinkwindow.open(map,sinkmarker);
    // });
​
    // google.maps.event.addDomListener(window, 'load', createMap);
​
    // $(document).ready(function() {
    //     var map;
    //     var service;
    //     var infowindow;
    //     var ac;
    //     // var sink = new google.maps.LatLng(40.008575,-105.276430)
    //     new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
    //     var service = new google.maps.places.PlacesService(map);
    //     google.maps.event.addListener(ac, 'place_changed', function() {
    //         var place = ac.getPlace();
    //         console.log(place.formatted_address);
    //         console.log(place.url);
    //         console.log(place.geometry.location);
    //     });
    //     var request = {
    //         // query: 'The Sink',
    //         // fields: ['name','photos','rating'],
    //         location: new google.maps.LatLng(-33.8736510, 151.20688960),
    //         radius: 500
    //     };
    //     service.search(request, function(results)
    //     {
    //         console.log(results.length);
    //         for (var i = 0; i < results.length; i++){
    //             console.log(results[i].name, results[i].types)
    //         }
    //     });
    // });
