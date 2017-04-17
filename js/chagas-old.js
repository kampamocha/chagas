window.onload = function() {
  //create empty vectors for layers
  var opossumSource = new ol.source.Vector({
        //create empty vector
  });

  var bugSource = new ol.source.Vector({
        //create empty vector
  });

  //create points and add to source vector
  var opossumFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([-89.29051004, 21.09880664])),
          name: '1',
          time: '2015/10/21 19:12:05',
          ele: 10.7
          });
  opossumSource.addFeature(opossumFeature);

  var opossumFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([-89.228468739, 21.08900819])),
          name: '2',
          time: '2015/10/21 19:23:34',
          ele: 10.941
          });
  opossumSource.addFeature(opossumFeature);

  var bugFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([-89.28487439, 21.08649203])),
          name: '3',
          time: '2015/10/21 19:30:51',
          ele: 11.181
          });
  bugSource.addFeature(bugFeature);

  var bugFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([-89.28489241, 21.08520113])),
          name: '4',
          time: '2015/10/21 19:35:15',
          ele: 12.623
          });
  bugSource.addFeature(bugFeature);

  //create the styles
  var opossumStyle = new ol.style.Style({
    image: new ol.style.Icon({
      opacity: 0.75,
      size: [594, 594],
      scale: 25/594,
      src: './img/icons/opossum-mammal-animal-silhouette.svg'
    })
  });

  var bugStyle = new ol.style.Style({
    image: new ol.style.Icon({
      opacity: 0.75,
      size: [580, 580],
      scale: 20/580,
      src: './img/icons/stink-bug-insect-shape.svg'
    })
  });

  //add the feature vector to the layer vector, and apply a style to whole layer
  var opossumLayer = new ol.layer.Vector({
    source: opossumSource,
    style: opossumStyle,
    visible: document.getElementById('check_opossum').checked
  });

  var bugLayer = new ol.layer.Vector({
    source: bugSource,
    style: bugStyle,
    visible: document.getElementById('check_bug').checked
  });

  //create Base Layer
  var baseLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
  });

  //draw the map
  var map = new ol.Map({
    target: 'map',
    layers: [
      baseLayer,
      opossumLayer,
      bugLayer
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-89.26972222, 21.12555556]),
      extent: ol.proj.transformExtent([-91.9, 19.2, -86.3, 22.0],"EPSG:4326", "EPSG:3857"),
      zoom: 15,
      minZoom: 8
    })
  });

  //hover action
  map.on('pointermove', function(evt) {
    if (evt.dragging) {
      $(element).popover('destroy');
      return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var hit = map.forEachLayerAtPixel(pixel, function() {
        return true;
      }, null, function(layer_candidate) {
        return layer_candidate !== baseLayer;
    });
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  //activate layers
  $("#check_opossum").change(function () {
      opossumLayer.setVisible(this.checked);
  });

  $("#check_bug").change(function () {
      bugLayer.setVisible(this.checked);
  });

  //popup
  element = document.getElementById('popup');

  var popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false
  });
  map.addOverlay(popup);

  // display popup on click
  map.on('click', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return feature;
      }, null, function(layer_candidate) {
        return layer_candidate !== baseLayer;
    });

    if (feature) {
      popup.setPosition(evt.coordinate);
  /*    $(element).popover({
        'placement': 'top',
        'html': true,
        'content': feature.get('name')
      });
  */
      $(element).attr('data-placement', 'top');
      $(element).attr('data-html', true);
      $(element).attr('data-content', feature.get('name'));
      $(element).popover('show'); 
    } else {
      $(element).popover('destroy');
      //popup.setPosition(undefined);
    }
  });
};