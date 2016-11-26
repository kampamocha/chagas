window.onload = function() {

  //path and filenames
  var path = './data/';

  // var files = ['2016-01.geojson',
  //             '2016-05.geojson',
  //             '2016-08.geojson',
  //             'Opossum.geojson'];

  var files = ['Opossum.geojson'];

  //map options
  var view_options = {
                      center: ol.proj.fromLonLat([-89.43944444, 20.91916667]), //Ticopó
                      extent: ol.proj.transformExtent([-91.9, 19.2, -86.3, 22.0],"EPSG:4326", "EPSG:3857"),
                      zoom: 10,
                      minZoom: 8
                    };

  //sources

  //create Base Layer
  var baseLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
  });

  //create Data layers
  var number_of_layers = files.length;
  var data_layers = [];

  for (i = 0; i < number_of_layers; i++) {
    
    //sources
    var source = new ol.source.Vector({
                    url: path + files[i],
                    format: new ol.format.GeoJSON({
                                  defaultDataProjection: 'EPSG: 3857'
                                })
                  });
    
    //styles
    // var style = new ol.style.Style ({
    //   fill: new ol.style.Fill({
    //           color: [250, 250, 250, 1]
    //         }),
    //   stroke: new ol.style.Stroke({
    //             color: [220,220,220,1],
    //             width: 1
    //           })
    // });

    // var opossumStyle = new ol.style.Style({
    //   image: new ol.style.Icon({
    //     opacity: 0.75,
    //     size: [594, 594],
    //     scale: 10/594,
    //     src: './img/icons/opossum-mammal-animal-silhouette.svg'
    //   })
    // });

    //layers
    var layer = new ol.layer.Vector({
                  source: source,
                  //style: style,
                  visible: !i   //only the first layer is visible
                });
    
    data_layers.push(layer);
  }

  //draw the map
  var map = new ol.Map({
    target: 'map',
    layers: [ baseLayer ].concat(data_layers),
    view: new ol.View(view_options)
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

  //activate or deactivate layers
  $('input[id|=visible]').change(function () {
    data_layers[this.value-1].setVisible(this.checked);
  });

  //popup
  element = document.getElementById('popup');

  var popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false
  });
  map.addOverlay(popup);

  // display popup on click and feature data
  map.on('click', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return feature;
      }, null, function(layer_candidate) {
        return layer_candidate !== baseLayer;
    });

    if (feature) {
      popup.setPosition(evt.coordinate);

      var content = '<strong>' + feature.get('Cve_Casa') + '</strong>';
      content += ' ' + feature.get('Fecha') + '<br>';
      content += 'GPS: ' + feature.get('Punto_GPS');

      $(element).attr('data-placement', 'top');
      $(element).attr('data-html', true);
      $(element).attr('data-content', content);
      $(element).popover('show');

      //Put info in data space
      //var keys = feature.getKeys();
      var coord = feature.getGeometry().getCoordinates();
      coord = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');

      var data = '<strong>ID: </strong>' + feature.get('Cve_Casa') + '<br>';
      data += '<strong>Fecha: </strong>' + feature.get('Fecha') + '<br>';
      data += '<strong>Localidad: </strong>' + feature.get('Localidad') + '<br>';
      data += '<strong>Punto GPS: </strong>' + feature.get('Punto_GPS') + '<br>';
      data += '<strong>Lon: </strong>' + coord[0].toFixed(8) + '<br>';
      data += '<strong>Lat: </strong>' + coord[1].toFixed(8) + '<br>';
      data += '<strong>LT (mm): </strong>' + feature.get('LT_mm') + '<br>';
      data += '<strong>LC (mm): </strong>' + feature.get('LC_mm') + '<br>';
      data += '<strong>Edad: </strong>' + feature.get('Edad') + '<br>';
      data += '<strong>Sexo: </strong>' + feature.get('Sexo') + '<br>';
      data += '<strong>Edo_Reprod: </strong>' + feature.get('Edo_Reprod') + '<br>';
      data += '<strong>Dx_T_cruzi: </strong>' + feature.get('Dx_T_cruzi') + '<br>';

      $('#feature-data').html(data);

    } else {
      $(element).popover('destroy');
      //popup.setPosition(undefined);
      $('#feature-data').html('');
    }
  });

  // Select features
  $('#select-localidad').change(function () {
    var localidad = $(this).val();
    var source = data_layers[0].getSource();
    var features = source.getFeatures();
    var empty_style = new ol.style.Style({ image: '' });

    if (localidad == 'Todas') {
      for (var i = 0; i < features.length; i++) {
        features[i].setStyle(null);
      }
    } else {
      for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        if (feature.get('Localidad') == localidad) {
          feature.setStyle(null);
        } else {
          feature.setStyle(empty_style);
        }
      }
    }    
  });

};