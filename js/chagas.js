window.onload = function() {

////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
////////////////////////////////////////////////////////////////
  //Helper function
  var updateStyles = function(features, local_key) {
    var localidad = towns[local_key].name;
    var new_center = towns[local_key].center;
    var new_zoom = towns[local_key].zoom;

    var view_options = {
                          center: new_center,
                          extent: ol.proj.transformExtent([-91.9, 19.2, -86.3, 22.0],"EPSG:4326", "EPSG:3857"),
                          zoom: new_zoom,
                          minZoom: 8
                        };

    map.setView(new ol.View(view_options));

    var empty_style = new ol.style.Style({ image: '' });
    var opossumRedStyle = new ol.style.Style({
      image: new ol.style.Icon({
        opacity: 0.75,
        size: [594, 594],
        scale: 15/594,
        src: './img/icons/opossum-red.svg'
      })
    });
    var opossumGreenStyle = new ol.style.Style({
      image: new ol.style.Icon({
        opacity: 0.75,
        size: [594, 594],
        scale: 15/594,
        src: './img/icons/opossum-green.svg'
      })
    });

    for (var i = 0, featuresNumber = features.length; i < featuresNumber; i++) {
      var feature = features[i];

      if (localidad == 'Todas' || feature.get('Localidad') == localidad) {
        if (feature.get('Captura')) {
          feature.setStyle( feature.get('Dx_T_cruzi') == 'Positivo' ? opossumRedStyle : opossumGreenStyle);
        } else {
          feature.setStyle(null);
        }
      } else {
        feature.setStyle(empty_style);
      }
    }
  };

//Filter features
  var calcCorners = function(local_key) {
    // var corners = {};
    // for(var i = 1, n = data_layers.length; i < n; i++) {
    //   var source = data_layers[i].getSource();
    //   var features = source.getFeatures();
    var center = towns[local_key].center;
    // }
    var wgs84Sphere= new ol.Sphere(6378137);
    var c1 = ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326');
    //var c2 = ol.proj.transform(old_center, 'EPSG:3857', 'EPSG:4326');
    //console.log(c1);
    //console.log(wgs84Sphere.haversineDistance(c1, c2));
    var corners = {
      up: wgs84Sphere.offset(c1, 2500, 0)[1],
      down: wgs84Sphere.offset(c1, -2500, 0)[1],
      right: wgs84Sphere.offset(c1, 2500, Math.PI / 2)[0],
      left: wgs84Sphere.offset(c1, -2500, Math.PI / 2)[0]
    }

    // var max_lat = wgs84Sphere.offset(c1, 2500, 0);
    // var min_lat = wgs84Sphere.offset(c1, -2500, 0);
    // var max_lon = wgs84Sphere.offset(c1, 2500, Math.PI / 2);
    // var min_lon = wgs84Sphere.offset(c1, -2500, Math.PI / 2);    

    return corners;
  }
  

////////////////////////////////////////////////////////////////
// EXECUTION
////////////////////////////////////////////////////////////////

  //path and filenames
  var path = './data/';

  var files = ['Infected.geojson',
               'NonInfected.geojson',
               'EmptyTrap.geojson'];

  //Styles
  var empty_style = new ol.style.Style({ image: '' });
  var infected_style = new ol.style.Style({
    image: new ol.style.Icon({
      opacity: 0.75,
      size: [594, 594],
      scale: 15/594,
      src: './img/icons/opossum-red.svg'
    })
  });
  var non_infected_style = new ol.style.Style({
    image: new ol.style.Icon({
      opacity: 0.75,
      size: [594, 594],
      scale: 15/594,
      src: './img/icons/opossum-green.svg'
    })
  });               
  var circle_style = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      stroke: new ol.style.Stroke({
        width: 0.7,
        //color: '#A8E2ED'
        color: '#115CD6'
      })//,
      //  fill: new ol.style.Fill({
      //    color: 'hsl(220,60%,60%)'
      // })
    })
  });

  var styles = [infected_style,
                non_infected_style,
                circle_style];

  var towns = {
    '0':         { name: 'Todas', center: ol.proj.fromLonLat([-89.43944444, 20.91916667]), zoom: 10, infected: 160, non_infected: 166, empty: 874 },
    '310070001': { name: 'Cacalchén', center: ol.proj.fromLonLat([-89.22818000, 20.9830986111]), zoom: 15, infected: 13, non_infected: 30, empty: 57 },
    '310200001': { name: 'Chicxulub Pueblo', center: ol.proj.fromLonLat([-89.5150761111, 21.1372894444]), zoom: 15, infected: 20, non_infected: 9, empty: 71 },
    '310360001': { name: 'Homún', center: ol.proj.fromLonLat([-89.2856605556, 20.7394877778]), zoom: 15, infected: 5, non_infected: 8, empty: 87 },
    '310450001': { name: 'Kopomá', center: ol.proj.fromLonLat([-89.8995258333, 20.64897]), zoom: 15, infected: 14, non_infected: 15, empty: 71 },
    '310500093': { name: 'Komchén', center: ol.proj.fromLonLat([-89.6616605556, 21.1034636111]), zoom: 15, infected: 16, non_infected: 20, empty: 64 },
    '310510001': { name: 'Mocochá', center: ol.proj.fromLonLat([-89.4520555556, 21.1056844444]), zoom: 15, infected: 7, non_infected: 1, empty: 92 },
    '310520001': { name: 'Motul', center: ol.proj.fromLonLat([-89.2839247222, 21.0955505556]), zoom: 14, infected: 11, non_infected: 20, empty: 69 },
    '310670001': { name: 'Seyé', center: ol.proj.fromLonLat([-89.3722527778, 20.8369866667]), zoom: 15, infected: 13, non_infected: 19, empty: 68 },
    '310680001': { name: 'Sinanché', center: ol.proj.fromLonLat([-89.1857833333, 21.225595]), zoom: 15, infected: 21, non_infected: 12, empty: 67 },
    '310870001': { name: 'Tetiz', center: ol.proj.fromLonLat([-89.9334488889, 20.9619116667]), zoom: 15, infected: 15, non_infected: 16, empty: 69 },
    '310900001': { name: 'Timucuy', center: ol.proj.fromLonLat([-89.513505, 20.8105080556]), zoom: 15, infected: 12, non_infected: 5, empty: 83 },
    '310930001': { name: 'Tixkokob', center: ol.proj.fromLonLat([-89.3949655556, 21.0025677778]), zoom: 15, infected: 13, non_infected: 11, empty: 76 }
  };

  //map options
  // var view_options = {
  //                     center: ol.proj.fromLonLat([-89.43944444, 20.91916667]), //Ticopó
  //                     extent: ol.proj.transformExtent([-91.9, 19.2, -86.3, 22.0],"EPSG:4326", "EPSG:3857"),
  //                     zoom: 10,
  //                     minZoom: 8
  //                   };

  var view_options = {
                      center: towns['0'].center, //Ticopó
                      extent: ol.proj.transformExtent([-91.9, 19.2, -86.3, 22.0],"EPSG:4326", "EPSG:3857"),
                      zoom: towns['0'].zoom,
                      minZoom: 8
                    };

  //sources

  //create Base Layer
  var baseLayer = new ol.layer.Tile({
        source: new ol.source.OSM({
          "url": "http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        })
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
    
    //layers
    var layer = new ol.layer.Vector({
                  source: source,
                  style: styles[i],
                  visible: true
                  //visible: !i   //only the first layer is visible
                });      
    
    data_layers.push(layer);
  }

/*  var sourceTowns = new ol.source.Vector({
                    url: path + 'polygonTowns.geojson',
                    format: new ol.format.GeoJSON({
                                  defaultDataProjection: 'EPSG: 3857'
                                })
              });

  var layerTowns = new ol.layer.Vector({
                  source: sourceTowns,
                  visible: true
  })

  data_layers.push(layerTowns);*/

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
    var local_key = $(this).val();
    //console.log(local_key);

    for(var i = 0, n = data_layers.length; i < n; i++) {
      var source = data_layers[i].getSource();
      var features = source.getFeatures();
      updateStyles(features, local_key);
    }

    if (local_key == '0') {
      $('#calc-btn').prop('disabled', true);
    }
    else {
      $('#calc-btn').prop('disabled', false); 
    }

  });

  // Calculate statistic
  $('#calc-btn').click(function () {
    var corners = calcCorners($('#select-localidad').val());
    console.log(corners);
  });
  //update styles
  // var tmp_source = data_layers[0].getSource();
  // var tmp_features = tmp_source.getFeatures();
  // updateStyles(tmp_features, 'Todas');


};




