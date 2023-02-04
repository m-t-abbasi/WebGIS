// Initial construction of a map
var map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([37.41, 56.82]),
      zoom: 4,
    }),
  });


// Iran states layer
const iranStatesSource = new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/wms",
    params: {'LAYERS': 'nyc:States', 'TILED': true},
    serverType: 'geoserver',
    transition: 0,
});


// USA states layer
const statesUSASource = new ol.source.TileWMS({
  url: "http://localhost:8080/geoserver/wms",
  params: {'LAYERS': 'topp:states', 'TILED': true},
  serverType: 'geoserver',
  transition: 0,
});

const statesUSA = new ol.layer.Tile({
  extent: [-13884991, 2870341, -7455066, 6338219],
  source: statesUSASource
});
map.addLayer(statesUSA);

// Iran states layer
const iranStatesSource = new ol.source.TileWMS({
  url: "http://localhost:8080/geoserver/wms",
  params: {'LAYERS': 'WebGIS:Provinc_1400', 'TILED': true},
  serverType: 'geoserver',
  transition: 0,
});

const iranStates = new ol.layer.Tile({
  extent: [44.041975225000215 , 25.0624173310001, 63.332885742000, 39.77509416100018],
  source: iranStatesSource 
});
map.addLayer(iranStates);


// Event handler
map.on("click", function (evt) {
    const coordinates = ol.proj.toLonLat(evt.coordinate);
    addMarker(coordinates);
    revserseGeocode(coordinates);
});

// Marker definition
var vectorSource = new ol.source.Vector({});

var dinamicPinLayer = new ol.layer.Vector({
    source: vectorSource,
});

map.addLayer(dinamicPinLayer);

// Reverse geocode function

async function revserseGeocode(coordinates) {
  var country, countryCode, countryCodeISO3, countrySubdivision, freeformAddress, localName, municipality, municipalitySubdivision, postalCode, street = '';  
  let key = 'rV1VkLIPGFCIGszAb7A3UEgeXvCG09Hs';
  let response =await fetch(https://api.tomtom.com/search/2/reverseGeocode/${coordinates[1]},${coordinates[0]}.json?key=${key}&radius=100)
  .then((response) => response = response.json())
  .then((response) => {
    var a = response['addresses'][0]['address'];
    country = a.country;
    countryCode = a.countryCode;
    countryCodeISO3 = a.countryCodeISO3;
    countrySubdivision = a.countrySubdivision;
    freeformAddress = a.freeformAddress;
    localName = a.localName;
    municipality = a.municipality;
    municipalitySubdivision = a.municipalitySubdivision;
    postalCode = a.postalCode;
    street = a.street;
  })
  addMarker(coordinates);
  let dom = document.getElementById('address');
  dom.innerHTML = country+'<br>'+countryCode+'<br>'+countryCodeISO3+'<br>'+countrySubdivision+'<br>'+freeformAddress+'<br>'+localName+'<br>'+municipality+'<br>'+municipalitySubdivision+'<br>'+postalCode+'<br>'+street+'<br>';
}



// generate a GetFeature request
// const featureRequest = new WFS().writeGetFeature({
//    srsName: 'EPSG:3857',
//    featureNS: 'http://openstreemap.org',
//    featurePrefix: 'osm',
//    featureTypes: ['water_areas'],
//    outputFormat: 'application/json',
//    filter: andFilter(
//      likeFilter('name', 'Mississippi*'),
//      equalToFilter('waterway', 'riverbank')
//    ),
//  });