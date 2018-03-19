var mainMap, miniMap, modalCenter, modalMarkers = [];
var study_index = [], locPoints;

function initMap() {
  mainMap = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.509106881962516,lng: 127.25703811645506},
    zoom: 15,
    streetViewControl: false
  });
  miniMap = new google.maps.Map(document.getElementById('miniMap'), {
    center: {lat: 0, lng: 0},
    zoom: 16,
    mapTypeControl: false,
    streetViewControl: false
  });
  google.maps.event.addListener(mainMap, "click", function (e) {
      console.log('lat: '+e.latLng.lat()+',lng: '+e.latLng.lng())
  });
}

function openInfoWindow(id) {
  $('#modal-loc-content').html("<p><b>\'"+locPoints[id].name+"\' 에서 진행된 연구 "+locPoints[id].studies.length+"개:</b></p> <ul class=\"study-modal-list\">");
  locPoints[id].studies.forEach(function(element) {
    var author="";
    for(var ind in study_index[element].author)
      author+=(study_index[element].author[ind]+", ");
    $('#modal-loc-content').append("<li class=\"study-modal-item\"><a href=\"detail.html?id="+element+"\">"+study_index[element].title+"</a>");
    $('#modal-loc-content').append("<span class=\"study-modal-author\"> by "+author.substring(0,author.length-2)+"</span></li>");
  });
  $('#modal-loc-title').html(locPoints[id].name);
  $('#modal-loc-desc').html(locPoints[id].desc);

  modalCenter = {lat: locPoints[id].lat, lng: locPoints[id].lng};
  $('#modal-loc').modal();
}
$(document).on('shown.bs.modal','#modal-loc', function () {
  google.maps.event.trigger(miniMap, 'resize'); //manually redraw map
  miniMap.setZoom(15);
  miniMap.setCenter(modalCenter);
  for(i=0; i<modalMarkers.length; i++){
    modalMarkers[i].setMap(null);
  }
  modalMarkers = []
  modalMarkers.push(new google.maps.Marker({
    position: modalCenter,
    map: miniMap
  }));
});

window.onload = function() {
  $('#mapCoords').click(function() {
    var ln = mainMap.getCenter();
    console.log('lat: '+ln.lat()+',lng: '+ln.lng()+', zoom: '+mainMap.getZoom() );
  });
  $.getJSON("data/study_index.json", function(data2) {
      study_index = data2;
      $.getJSON("data/points.json", function(data) {
      locPoints = data;
      locPoints.forEach(function(element) {
        var marker = new google.maps.Marker({
          position: {lat: element.lat, lng: element.lng},
          map: mainMap
        });
        marker.addListener('click', function() {
          openInfoWindow(element.id-1);
        });
      });
    });
  });
};
