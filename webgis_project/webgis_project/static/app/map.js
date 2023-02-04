var map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([37.41, 8.82]),
      zoom: 4,
    }),
  });


// IRAN states layer
//  const statesIRANSource = new ol.source.TileWMS({
//    url: "http://localhost:8080/geoserver/wms",
//    params: {'LAYERS': 'python:IRN_adm0', 'TILED': true},
//    serverType: 'geoserver',
//    transition: 0,
//});

// const statesUSA = new ol.layer.Tile({
//    extent: [-13884991, 2870341, -7455066, 6338219],
//    source: statesUSASource
//});
map.addLayer(statesIRAN);

// Iran states layer
const iranStatesSource = new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/wms",
    params: {'LAYERS': 'python:IRN_adm0', 'TILED': true},
    serverType: 'geoserver',
    transition: 0,
});

const iranStates = new ol.layer.Tile({
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
async function revserseGeocode(coordiantes) {
    request = "https://api.tomtom.com/search/2/reverseGeocode/" + String(coordiantes[1]) + "," + String(coordiantes[0]);
    request += ".json?key=rV1VkLIPGFCIGszAb7A3UEgeXvCG09Hs&radius=100";

    fetch(request)
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

// Get feature information
map.on("click", function (evt) {
    var viewResolution = /** @type {number} */ (view.getResolution());
    console.log(viewResolution);
        var url = iranStatesSource.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, 'EPSG:3857',
            {'INFO_FORMAT': 'application/json'});
    console.log(url);

    result = document.getElementById("identify");

    const headings = ["State", "Area", "Population"];

    fetch(url)
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




// Get feature with WFS
// var url = "http://localhost:8080/geoserver/nyc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nyc%3Aafrica2&maxFeatures=50&outputFormat=application%2Fjson" 

// var africaSource = new ol.source.Vector({
//        format: new ol.format.GeoJSON(),
//        url: function(extent) {
//            return url
//        },
//});

tiled = new OpenLayers.Layer.WMS( 
    "unit_project2_ws:unit_project3_view - Tiled", 
    "http://localhost:8080/geoserver/it.geosolutions/wms",
    {
        LAYERS: 'unit_project2_ws:unit_project3',
        transparent: true,
        STYLES: '',
        format: format,
        tiled: true,
        tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom

    },
    {
        buffer: 0,
        displayOutsideMaxExtent: true,
        isBaseLayer: false,
        yx : {'EPSG:900913' : false}
    } 
);



// generate a GetFeature request
const featureRequest = new WFS().writeGetFeature({
    srsName: 'EPSG:3857',
    featureNS: 'http://openstreemap.org',
    featurePrefix: 'osm',
    featureTypes: ['water_areas'],
    outputFormat: 'application/json',
    filter: andFilter(
      likeFilter('name', 'Mississippi*'),
      equalToFilter('waterway', 'riverbank')
    ),
  });