var map;
var attrib="Map data copyright OpenStreetMap contributors, Open Database Licence";
var defaultLocation = [51, -1];
var defaultBbox = [-1.5, 50.8, -1.3, 50.9];
var west;
var east;
var south;
var north;
var geojsonsonLayer

function init()
{
	map = L.map("map1");
    L.tileLayer
        ("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            { attribution: attrib } ).addTo(map);
            
    map.setView(defaultLocation, 14);
	map.on("dragend", onDragEnd); 
	
	geojsonLayer = new L.geoJSON();
	// Set up our AJAX connection variable (this is an object, for those of you who have done OO programming)
    var ajaxConnection = new XMLHttpRequest();
	
	west = defaultBbox[0];
	south = defaultBbox[1];
	east = defaultBbox[2];
	north = defaultBbox[3];
	
        // Set up the callback function. Here, the callback is an arrow function.
        ajaxConnection.addEventListener ("load",e => 
            { 
                var geojson = JSON.parse(e.target.responseText);
				for(var i=0; i<geojson.features.length; i++)
				{
					 geojsonLayer.addData(geojson.features[i]);
				}
            });
    
   
        // Open the connection to a given remote URL.
    ajaxConnection.open("GET" , `https://edward2.solent.ac.uk/wad/restaurants.php?bbox=` + west +`,`+south+`,`+east+`,`+north+`&format=geojson
`);
    
        // Send the request.
    ajaxConnection.send();
	
	
    if(navigator.geolocation)
    {
        navigator.geolocation.watchPosition (processPosition, handleError,
                    {enableHighAccuracy:true, maximumAge: 5000 }
                                        );
    }
    else
    {
        alert("Sorry, geolocation not supported in this browser");
    }
}

function onDragEnd(){
	
	west = map.getBounds().getSouthWest().lng;
	south = map.getBounds().getSouthWest().lat;
	east = map.getBounds().getNorthEast().lng;
	north = map.getBounds().getNorthEast().lat;
	
	var ajaxConnection = new XMLHttpRequest();
	
        // Set up the callback function. Here, the callback is an arrow function.
        ajaxConnection.addEventListener ("load",e => 
            { 
                var geojson = JSON.parse(e.target.responseText);
				for(var i=0; i<geojson.features.length; i++)
				{
					 geojsonLayer.addData(geojson.features[i]);
					 console.log(geojson.features[i]);
				}
            });
    
   
        // Open the connection to a given remote URL.
    ajaxConnection.open("GET" , `https://edward2.solent.ac.uk/wad/restaurants.php?bbox=` + west +`,`+south+`,`+east+`,`+north+`&format=geojson
`);
    
        // Send the request.
    ajaxConnection.send();
}

function processPosition(gpspos)
{
    var newPosition = [gpspos.coords.latitude, gpspos.coords.longitude];
	map.setView(newPosition, 14);
    console.log(newPosition); // show on the console
}

function handleError(err)
{
    alert('An error occurred: ' + err.code);
}
