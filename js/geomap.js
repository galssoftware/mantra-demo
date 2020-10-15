var map = L.map('map').setView([55.755240, 37.631653], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(map);


var okIcon = new L.divIcon({
	html: "<div class='pin' style='background:#2aa043'></div>",
  iconSize: 0,
  shadowSize: 0,
  popupAnchor: [-4, -33],
  iconAnchor: [0, 15]
});

var infoIcon = new L.divIcon({
	html: "<div class='pin' style='background:#00bfff;'></div>",
  iconSize: 0,
  shadowSize: 0,
  popupAnchor: [-4, -33],
  iconAnchor: [0, 15]
});

var warningIcon = new L.divIcon({
	html: "<div class='pin' style='background:#d16e0a'></div><div class='pulse'></div>",
  iconSize: 0,
  shadowSize: 0,
  popupAnchor: [-4, -33],
  iconAnchor: [0, 15]
});

var averageIcon = new L.divIcon({
	html: "<div class='pin' style='background:#ff6800;'></div><div class='pulse'></div>",
  iconSize: 0,
  shadowSize: 0,
  popupAnchor: [-4, -33],
  iconAnchor: [0, 15]
});

var highIcon = new L.divIcon({
	html: "<div class='pin' style='background:#eb6e63;'></div><div class='pulse'></div>",
  iconSize: 0,
  shadowSize: 0,
  popupAnchor: [-4, -33],
  iconAnchor: [0, 15]
});

var disasterIcon = new L.divIcon({
	html: "<div class='pin' style='background:#6f001f;'></div><div class='pulse'></div>",
  iconSize: 0,
  shadowSize: 0,
  popupAnchor: [-4, -33],
  iconAnchor: [0, 15]
});

var severityToIconMap = {
  "0" : okIcon,
  "1" : infoIcon,
  "2" : warningIcon,
  "3" : averageIcon,
  "4" : highIcon,
  "5" : disasterIcon
};

var markers = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
  	zoomToBoundsOnClick: true,
    spiderLegPolylineOptions: { weight: 1.5, color: '#222', opacity: 0.0 },
    maxClusterRadius: 100,
    iconCreateFunction: function (cluster) {
      var markers = cluster.getAllChildMarkers();

      var clusterIcons = [];
      var clusterClass = "cluster"
      markers.forEach(function(element) {
        clusterIcons.push(element.options.icon);
      });
      if(clusterIcons.includes(okIcon)) {
        clusterClass = "cluster cluster-ok";
      }
      if(clusterIcons.includes(infoIcon)) {
        clusterClass = "cluster cluster-info";
      }
      if(clusterIcons.includes(warningIcon)) {
        clusterClass = "cluster cluster-warning";
      }
      if(clusterIcons.includes(averageIcon)) {
        clusterClass = "cluster cluster-average";
      }
      if(clusterIcons.includes(highIcon)) {
        clusterClass = "cluster cluster-high";
      }
      if(clusterIcons.includes(disasterIcon)) {
        clusterClass = "cluster cluster-disaster";
      }

      if(clusterClass == "cluster cluster-ok") {
        return L.divIcon({ html: "<i class='fa fa-thumbs-up'></i>", className: clusterClass, iconSize: L.point(40, 33) });
      } else {
        return L.divIcon({ html: "<i class='fa fa-thumbs-down'></i>", className: clusterClass, iconSize: L.point(40, 33) });
      }

    },
  });

map.addLayer(markers);

function setMarkers() {
  var markersList = [];

  var data = demodata.data;
  triggerList = data.triggers;

  markers.eachLayer(function (layer) {
    markers.removeLayer(layer);
  });

  data.forEach(function(host) {
    var tooltip = host.message;

    marker = L.marker([host.location_lat, host.location_lon], {icon: severityToIconMap[host.severity]}).bindPopup(tooltip);

    markersList.push(marker);
    markers.addLayer(marker);
  });
}

$(document).ready(function() {
  setMarkers();
});

$(window).resize(function() {
  setMarkers();
});
setInterval(function() {
  setMarkers();
}, 60 * 1000);
