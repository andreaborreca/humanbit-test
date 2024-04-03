//definizione variabile di controllo per il click delle zone

let zoneClicked;

//funzione di ricerca dei bottoni delle zone per inizializzazione




    }
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: clickZone
    });
}

function fadeInLayerLeaflet(lyr, startOpacity, finalOpacity, finalFillOpacity, opacityStep, fillOpacityStep, delay) {
    let opacity = startOpacity;
    let fillOpacity = startOpacity;
    let timer = setTimeout(function changeOpacity() {
      if (opacity < finalOpacity) {
        lyr.setStyle({
          opacity: opacity,
        });
        opacity = opacity + opacityStep
      }
      if (fillOpacity < finalFillOpacity) {
        lyr.setStyle({
          fillOpacity: finalFillOpacity
        });
        fillOpacity = fillOpacity + fillOpacityStep
      }

      timer = setTimeout(changeOpacity, delay);
    }, delay)
}

function style_start(feature) {
    let color = {
        fillColor: '#A4B8C4',
        weight: 2,
        opacity: 1,
        color: '#87919E',
        dashArray: '1',
        fillOpacity: 0.3
    };
    return color;
}

function style(feature) {
    let color;
    for(i=0; i< zones.length; i++){
        let zone_name = zones[i].substr(0, zones[i].indexOf('/'));
        if(feature.properties.name == zone_name){
            let zone_price = zones[i].substring(zones[i].indexOf('/') + 1);
            if(zoneOut.includes(zone_name)){
                color = {
                    fillColor: '#A4B8C4',
                    weight: 2,
                    opacity: 1,
                    color: '#87919E',
                    dashArray: '1',
                    fillOpacity: 0.3
                };
            } else if(budget < zone_price){
                color = {
                    fillColor: '#f6b9b3',
                    weight: 2,
                    opacity: 1,
                    color: '#87919E',
                    dashArray: '1',
                    fillOpacity: 0.5
                };
            } else {
                color = {
                    fillColor: '#7DD87D',
                    weight: 2,
                    opacity: 1,
                    color: 'green',
                    dashArray: '1',
                    fillOpacity: 0.5
                };
            }
        }
    }
    return color;
}

//funzione di highlight delle zone nella mappa

function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#035567',
        dashArray: '1',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

//funzione di reset dello stile delle zone

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

//funzione di click delle zone

function clickZone(e) {
    let layer = e.target;
    zoneClicked = layer;
}

function onEachFeatureClicked(feature, layer) {
    layer.bindTooltip('<p>'+ feature.properties.name + '</p>');
    layer.setStyle({className: 'zone zone_click'});
    for(i=0; i< zones.length; i++){
        let zone_name = zones[i].substr(0, zones[i].indexOf('/'));
        if(feature.properties.name == zone_name){
            let zone_price = zones[i].substring(zones[i].indexOf('/') + 1);
            layer.feature.properties.budget = zone_price;
            layer.bindTooltip('<p>'+ feature.properties.name + ': ' + zone_price + '€</p>');
            if(zoneOut.includes(zone_name)){
                let text = $(".zone_out_label").text();
                layer.setStyle({className: 'rosso grigio'});
                layer.feature.properties.color = 'rosso';
                layer.bindTooltip('<p>'+ feature.properties.name + ': ' + zone_price + '€ - <span class="me-2" style="font-size:14px;color:red;"><i class="fa-solid fa-ban"></i></span><span style="font-size:14px;color:red;">' + text + '</span></p>');
            } else if(budget < zone_price){
                let text = $(".increase_budget_label").text();
                layer.setStyle({className: 'rosso rossoOut'});
                layer.feature.properties.color = 'rosso';
                layer.bindTooltip('<p>'+ feature.properties.name + ': ' + zone_price + '€ - <span class="me-2" style="font-size:14px;color:red;"><i class="fa-solid fa-ban"></i></span><span style="font-size:14px;color:red;">' + text + '</span></p>');
            } else {
                layer.setStyle({className: 'zone zone_click verde'});
                layer.feature.properties.color = 'verde';
            }
        }

    }
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: clickZone
    });

    $('body').on('click', '.btn_book_zone', function(){
        let leaflet_id = $(this).data('leaflet-id');
        for(var key in geojson._layers){
            if(Number(key) === Number(leaflet_id)){
                let zoneClick = geojson._layers[key];
                let zone = geojson._layers[key]._path;
                let zone_input = $('#zone_input').val();
                let zones = selected_zones.split(',');
                $(zone).removeClass('zone_click');
                $(zone).attr('style', '');
                $('#fav_zone_div').find('[data-leaflet-id="' + zoneClick._leaflet_id + '"]').remove();
                let array = zone_input.split(',');
                for(i=0; i<array.length; i++){
                    if(array[i] === zoneClick.feature.properties.name){
                        array.splice(i, 1);
                        zones.splice(i, 1);
                        selected_zones = zones.toString();
                    }
                }
                zone_input = array.toString();
                $('#zone_input').val(zone_input);
                let zone_input_count = zone_input.split(",").length;
                if(zone_input != ""){
                    $(".zone_found").text(zone_input_count);
                    if((zone_input_count >= 1) && (zone_input_count <= 2)){
                        $(".zone_found").attr('style', 'color:rgba(233, 182, 89, 0.9);');
                        $(".no_zones").addClass('d-none');
                        $(".info_zones").removeClass('d-none');
                    } else {
                        $(".zone_found").attr('style', 'color:#7DD87D;');
                        $(".no_zones").addClass('d-none');
                        $(".info_zones").addClass('d-none');
                    }
                } else {
                    $(".zone_found").text(0);
                    $(".zone_found").attr('style', 'color:rgba(233, 182, 89, 0.9);');
                }
            }
        }
    });

    $('.help_book_content .help_book_hover').click(function(){
        if ($(".how_to_use_map_2").hasClass('opacity_0')) {
            $(".how_to_use_map_2").removeClass('opacity_0');
            $(".how_to_use_map_2").removeClass('d-none');
            $(".how_to_use_map_2").fadeTo("slow", 1);
			$(".help_book_container .help_book_hover").removeClass('fa-question');
			$(".help_book_container .help_book_hover").addClass('fa-xmark');
        } else {
            $(".how_to_use_map_2").fadeTo("slow", 0);
            setTimeout(function(){
                $(".how_to_use_map_2").addClass('opacity_0 d-none');
                $(".help_book_container .help_book_hover").removeClass('fa-xmark');
			    $(".help_book_container .help_book_hover").addClass('fa-question');
            }, 1000);
        }
    });

    $('.help_book_content .location_book_hover').click(function(){
        if ($(".location_list").hasClass('opacity_0')) {
            $(".location_list").removeClass('opacity_0');
            $(".location_list").removeClass('d-none');
            $(".location_list").fadeTo("slow", 1);
			$(".help_book_container .location_book_hover").removeClass('fa-location-smile');
			$(".help_book_container .location_book_hover").addClass('fa-location-xmark');
        } else {
            $(".location_list").fadeTo("slow", 0);
            setTimeout(function(){
                $(".location_list").addClass('opacity_0 d-none');
                $(".help_book_container .location_book_hover").removeClass('fa-location-xmark');
                    $(".help_book_container .location_book_hover").addClass('fa-location-smile');
            }, 1000);
        }
    });

    $('.help_book_container .help_button').click(function(){
        if ($(".how_to_use_map_2").hasClass('opacity_0')) {
            if (!($(".location_list").hasClass('opacity_0'))) {
                $(".location_list").fadeTo("slow", 0);
                setTimeout(function(){
                    $(".location_list").addClass('opacity_0 d-none');
                    $(".help_book_container .location_book_hover").removeClass('fa-location-xmark');
                    $(".help_book_container .location_book_hover").addClass('fa-location-smile');
                }, 1000);
            }
            $(".how_to_use_map_2").removeClass('opacity_0');
            $(".how_to_use_map_2").removeClass('d-none');
            $(".how_to_use_map_2").fadeTo("slow", 1);
			$(".help_book_container .help_book_hover").removeClass('fa-question');
			$(".help_book_container .help_book_hover").addClass('fa-xmark');
        } else {
            $(".how_to_use_map_2").fadeTo("slow", 0);
            setTimeout(function(){
                $(".how_to_use_map_2").addClass('opacity_0 d-none');
                $(".help_book_container .help_book_hover").removeClass('fa-xmark');
			    $(".help_book_container .help_book_hover").addClass('fa-question');
            }, 1000);
        }

	});

    $('.help_book_container .location_button').click(function(){
        if ($(".location_list").hasClass('opacity_0')) {
            if (!($(".how_to_use_map_2").hasClass('opacity_0'))) {
                $(".how_to_use_map_2").fadeTo("slow", 0);
                setTimeout(function(){
                    $(".how_to_use_map_2").addClass('opacity_0 d-none');
                    $(".help_book_container .help_book_hover").removeClass('fa-xmark');
                    $(".help_book_container .help_book_hover").addClass('fa-question');
                }, 1000);
            }
            $(".location_list").removeClass('opacity_0');
            $(".location_list").removeClass('d-none');
            $(".location_list").fadeTo("slow", 1);
			$(".help_book_container .location_book_hover").removeClass('fa-location-smile');
			$(".help_book_container .location_book_hover").addClass('fa-location-xmark');
        } else {
            $(".location_list").fadeTo("slow", 0);
            setTimeout(function(){
                $(".location_list").addClass('opacity_0 d-none');
                $(".help_book_container .location_book_hover").removeClass('fa-location-xmark');
			    $(".help_book_container .location_book_hover").addClass('fa-location-smile');
            }, 1000);
        }

	});

    $(".location_poi_map").on("click", function(){
        let address_val = $(this).data("address");
        let radius_val = $(this).data("radius");
        $("#search_button").val(address_val);
        $('#address_poi_input').val(address_val);
        $('#radius_input').val(radius_val);
        let min_latlng_array = city_latlng_min.split(',');
        let max_latlng_array = city_latlng_max.split(',');
        let min_latlng = min_latlng_array[1] + ',' + min_latlng_array[0];
        let max_latlng = max_latlng_array[1] + ',' + max_latlng_array[0];
        let city_min_latlng = min_latlng;
        let city_max_latlng = max_latlng;
        let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURI(address_val) + ".json?bbox=" + encodeURI(city_min_latlng) + ',' + encodeURI(city_max_latlng) + "&types=address,poi&limit=5&access_token=pk.eyJ1IjoiYm9ycmVjYWhiIiwiYSI6ImNsM2p4bGthcjBpcXUzaHFpb3Q5eG1sdDYifQ.8j9jswc_pAM2Lb2_Vn-qzw"
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            cors: true ,
            contentType:'application/json',
            secure: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            beforeSend: function(){
            },
            success: function (data) {
                zoneIn = [];
                zoneOut = [];
                nameZone = [];
                map.removeLayer(geojson);
                geojson = L.geoJson(geojson_name, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
                if(search_on === 1){
                    map.removeLayer(marker);
                    map.removeLayer(circle);
                }
                $(deleteButton).fadeTo("slow", 1);
                $(deleteButton).attr('style', '');
                if(data.features.length > 0){
                    let name = data.features[0].place_name;
                    lat = data.features[0].center[0];
                    lng = data.features[0].center[1];
                    marker = new L.Marker([lng, lat], {
                        icon: L.divIcon({
                            className: 'leaflet-mouse-marker',
                            iconAnchor: [1, 1],
                            iconSize: [1, 1]
                        })
                    }).addTo(map);
                    circle = L.circle([lng, lat], {
                        color: '#078ba8',
                        fillColor: '#8cc9cb',
                        fillOpacity: 0.4,
                        radius: radius_val,
                    }).addTo(map);
                    $('#add_circle').attr('style', 'display:none;');
                    $('#delete_circle').attr('style', 'display:block;');
                    circle.editing.enable();
                    marker_circle = L.layerGroup([marker, circle]);
                    map.addLayer(marker_circle);
                    for(var key in zoneAll._layers) {
                        let coordinates = zoneAll._layers[key].feature.geometry.coordinates[0];
                        let counter_c = 0;
                        for(i=0;i<coordinates.length;i++){
                            let lat_c = coordinates[i][0];
                            let lng_c = coordinates[i][1];
                            let marker_test = new L.Marker([lng_c, lat_c]);
                            var d = map.distance(marker_test.getLatLng(), circle.getLatLng());
                            var isInside = d < circle.getRadius();
                            if(isInside){
                                counter_c++;
                            }
                        }
                        if(counter_c >= (coordinates.length / 2)){
                            nameZone.push(zoneAll._layers[key].feature.properties.name);
                        }

                    }
                    let id = [];
                    $('.zone_click').attr('style', 'fill-opacity:0.7;');
                    $('#fav_zone_div').find('.btn_book_zone').remove();
                    let zone_val = '';
                    $(".zone").removeClass("zone_click");
                    for(let key in geojson._layers){
                        fadeInLayerLeaflet(geojson._layers[key], geojson._layers[key].options.opacity, 1, 0.3, 0.3, 0.1, 100);
                        if(nameZone.includes(geojson._layers[key].feature.properties.name)){
                            id.push(geojson._layers[key]._leaflet_id);
                            let price_border = '';
                            if(!(geojson._layers[key].feature.properties.color === 'rosso')){
                                $('#fav_zone_div').append('<button type="button" class="btn_book_zone ' + geojson._layers[key].feature.properties.color + ' btn_book btn_bg_first mb-2 px-2" style="border:' + price_border + ';" data-leaflet-id="' + geojson._layers[key]._leaflet_id + '" data-id="' + geojson._layers[key].feature.id + '">' + geojson._layers[key].feature.properties.name + ': ' + geojson._layers[key].feature.properties.budget + '€</button>');
                                if(zone_val != ''){
                                    zone_val = zone_val + ',' + geojson._layers[key].feature.properties.name;
                                } else {
                                    zone_val = geojson._layers[key].feature.properties.name;
                                }
                                geojson._layers[key].setStyle({
                                    fillColor: '#7DD87D',
                                    weight: 2,
                                    opacity: 1,
                                    color: 'green',
                                    dashArray: '1',
                                    fillOpacity: 0.5
                                });
                                geojson._layers[key].setStyle({className: 'zone zone_click verde'});
                                geojson._layers[key].feature.properties.color = 'verde';
                                zoneIn.push(geojson._layers[key].feature.properties.name);
                            }

                        } else {
                            geojson._layers[key].setStyle({
                                fillColor: '#f6b9b3',
                            weight: 2,
                            opacity: 1,
                            color: '#87919E',
                            dashArray: '1',
                            fillOpacity: 0.5
                            });
                            geojson._layers[key].setStyle({className: 'rosso'});
                            geojson._layers[key].feature.properties.color = 'rosso';
                            zoneOut.push(geojson._layers[key].feature.properties.name);
                        }
                    }
                    map.removeLayer(geojson);
                    geojson = L.geoJson(geojson_name, {
                        style: style,
                        onEachFeature: onEachFeature
                    }).addTo(map);
                    let zones = zone_val.split(',');
                    searchAndSelectZone(zones,geojson);
                    $('#fav_zone_div').removeClass('d-none');
                    $('.leaflet-edit-move').html('<div class="hover_move">Move the circle around your interest point</div>');
                    $('.leaflet-edit-resize').html('<div class="hover_resize">Resize the circle around your interest point</div>');
                    marker.bindPopup(name).openPopup();
                    circle.on('editdrag', function(event){
                        zoneIn = [];
                        zoneOut = [];
                        nameZone = [];
                        map.removeLayer(geojson);
                        geojson = L.geoJson(geojson_name, {
                            style: style,
                            onEachFeature: onEachFeature
                        }).addTo(map);
                        if (marker) {
                            map.removeLayer(marker);
                        }
                        let radius = this._mRadius;
                        let new_pos = event.target.getLatLng();
                        let new_pos_lat = new_pos.lat;
                        let new_pos_lng = new_pos.lng;
                        marker = new L.Marker(new_pos, {
                            icon: L.divIcon({
                                className: 'leaflet-mouse-marker',
                                iconAnchor: [1, 1],
                                iconSize: [1, 1]
                            })
                        });
                        marker_circle = L.layerGroup([marker, circle]);
                        map.addLayer(marker_circle);
                        for(var key in zoneAll._layers) {
                            let coordinates = zoneAll._layers[key].feature.geometry.coordinates[0];
                            let counter_c = 0;
                            for(i=0;i<coordinates.length;i++){
                                let lat_c = coordinates[i][0];
                                let lng_c = coordinates[i][1];
                                let marker_test = new L.Marker([lng_c, lat_c]);
                                var d = map.distance(marker_test.getLatLng(), circle.getLatLng());
                                var isInside = d < circle.getRadius();
                                if(isInside){
                                    counter_c++;
                                }
                            }
                            if(counter_c >= (coordinates.length / 2)){
                                nameZone.push(zoneAll._layers[key].feature.properties.name);
                            }
                        }
                        let id = [];
                        $('.zone_click').attr('style', 'fill-opacity:0.7;');
                        $('#fav_zone_div').find('.btn_book_zone').remove();
                        let zone_val = '';
                        $(".zone").removeClass("zone_click");
                        for(let key in geojson._layers){
                            fadeInLayerLeaflet(geojson._layers[key], geojson._layers[key].options.opacity, 1, 0.3, 0.3, 0.1, 100);
                            if(nameZone.includes(geojson._layers[key].feature.properties.name)){
                                id.push(geojson._layers[key]._leaflet_id);
                                let price_border = '';
                                if(!(geojson._layers[key].feature.properties.color === 'rosso')){
                                    $('#fav_zone_div').append('<button type="button" class="btn_book_zone ' + geojson._layers[key].feature.properties.color + ' btn_book btn_bg_first mb-2 px-2" style="border:' + price_border + ';" data-leaflet-id="' + geojson._layers[key]._leaflet_id + '" data-id="' + geojson._layers[key].feature.id + '">' + geojson._layers[key].feature.properties.name + ': ' + geojson._layers[key].feature.properties.budget + '€</button>');
                                    if(zone_val != ''){
                                        zone_val = zone_val + ',' + geojson._layers[key].feature.properties.name;
                                    } else {
                                        zone_val = geojson._layers[key].feature.properties.name;
                                    }
                                    geojson._layers[key].setStyle({
                                        fillColor: '#7DD87D',
                                        weight: 2,
                                        opacity: 1,
                                        color: 'green',
                                        dashArray: '1',
                                        fillOpacity: 0.5
                                    });
                                    geojson._layers[key].setStyle({className: 'zone zone_click verde'});
                                    geojson._layers[key].feature.properties.color = 'verde';
                                    zoneIn.push(geojson._layers[key].feature.properties.name);
                                }

                            } else {
                                geojson._layers[key].setStyle({
                                    fillColor: '#A4B8C4',
                                    weight: 2,
                                    opacity: 1,
                                    color: '#87919E',
                                    dashArray: '1',
                                    fillOpacity: 0.3
                                });
                                geojson._layers[key].setStyle({className: 'rosso'});
                                geojson._layers[key].feature.properties.color = 'rosso';
                                zoneOut.push(geojson._layers[key].feature.properties.name);
                            }
                        }
                        map.removeLayer(geojson);
                        geojson = L.geoJson(geojson_name, {
                            style: style,
                            onEachFeature: onEachFeature
                        }).addTo(map);
                        let zones = zone_val.split(',');
                        searchAndSelectZone(zones,geojson);
                        $('#fav_zone_div').removeClass('d-none');
                        let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + new_pos_lng + ',' + new_pos_lat + ".json?types=address,poi&limit=1&access_token=pk.eyJ1IjoiYm9ycmVjYWhiIiwiYSI6ImNsM2p4bGthcjBpcXUzaHFpb3Q5eG1sdDYifQ.8j9jswc_pAM2Lb2_Vn-qzw"
                        $.ajax({
                            type: 'GET',
                            url: url,
                            dataType: 'json',
                            cors: true ,
                            contentType:'application/json',
                            secure: true,
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                            },
                            beforeSend: function(){
                            },
                            success: function (data) {
                                let new_address = data.features[0].place_name;
                                $('#radius_input').val(radius);
                                $('#address_poi_input').val(new_address);
                                $('#search_button').val(new_address);
                                marker.bindPopup(new_address).openPopup();
                            },
                            error: function(data) {
                            }
                        });
                    });
                }
            },
            error: function(data) {
            }
        });
    });

    $("body").on("click", ".grigio", function(){
        if ($(".help_zone_no_budget").hasClass('opacity_0')) {
            if ($(".help_zone_out").hasClass('opacity_0')) {
                $(".help_zone_out").removeClass('opacity_0');
                $(".help_zone_out").removeClass('d-none');
                $(".help_zone_out").fadeTo("slow", 1);

                setTimeout(function(){
                    $(".help_zone_out").fadeTo("slow", 0);
                    setTimeout(function(){
                        $(".help_zone_out").addClass('opacity_0 d-none');
                    }, 1000);
                }, 3000);
            }
        }
    });

    $("body").on("click", ".rossoOut", function(){
        if ($(".help_zone_out").hasClass('opacity_0')) {
            if ($(".help_zone_no_budget").hasClass('opacity_0')) {
                $(".help_zone_no_budget").removeClass('opacity_0');
                $(".help_zone_no_budget").removeClass('d-none');
                $(".help_zone_no_budget").fadeTo("slow", 1);

                setTimeout(function(){
                    $(".help_zone_no_budget").fadeTo("slow", 0);
                    setTimeout(function(){
                        $(".help_zone_no_budget").addClass('opacity_0 d-none');
                    }, 1000);
                }, 3000);
            }
        }
    });

    $(document).mouseup(function(e) 
	{
		var container = ""; 

		if (!($(".how_to_use_map_2").hasClass('opacity_0'))) {
            container = $(".how_to_use_map_2");
            if (!container.is(e.target) && container.has(e.target).length === 0) 
            {
                $(".how_to_use_map_2").fadeTo("slow", 0);
                setTimeout(function(){
                    $(".how_to_use_map_2").addClass('opacity_0 d-none');
                    $(".help_book_container .help_book_hover").removeClass('fa-xmark');
                    $(".help_book_container .help_book_hover").addClass('fa-question');
                }, 1000);
            }
        } else if (!($(".location_list").hasClass('opacity_0'))) {
            container = $(".location_list");
            if (!container.is(e.target) && container.has(e.target).length === 0) 
            {
                $(".location_list").fadeTo("slow", 0);
                setTimeout(function(){
                    $(".location_list").addClass('opacity_0 d-none');
                    $(".help_book_container .location_book_hover").removeClass('fa-location-xmark');
                    $(".help_book_container .location_book_hover").addClass('fa-location-smile');
                }, 1000);
            }
        }
	});

    $('#search_button').on('input',function(e){
		if (!($(".how_to_use_map_2").hasClass('opacity_0'))) {
			$(".how_to_use_map_2").fadeTo("slow", 0);
			setTimeout(function(){
				$(".how_to_use_map_2").addClass('opacity_0 d-none');
				$(".help_book_container .help_book_hover").removeClass('fa-xmark');
				$(".help_book_container .help_book_hover").addClass('fa-question');
			}, 1000);
		}

		// if (!$(".how_to_use_map_1, .how_to_use_map_2").hasClass("opacity_0")) {
		// 	$(".how_to_use_map_1, .how_to_use_map_2").fadeTo("slow", 0);
		// 	setTimeout(function () {
		// 		$(".how_to_use_map_1, .how_to_use_map_2").addClass("opacity_0 d-none");
		// 		$(".help_book_container .help_book_hover").removeClass("fa-xmark");
		// 		$(".help_book_container .help_book_hover").addClass("fa-question");
		// 	}, 1000);
		// }

        let char = $(this).val().length;
        let search = $(this).val();
        if(char > 3){
            let min_latlng_array = city_latlng_min.split(',');
            let max_latlng_array = city_latlng_max.split(',');
            let min_latlng = min_latlng_array[1] + ',' + min_latlng_array[0];
            let max_latlng = max_latlng_array[1] + ',' + max_latlng_array[0];
            let city_min_latlng = min_latlng;
            let city_max_latlng = max_latlng;
            let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURI(search) + ".json?bbox=" + encodeURI(city_min_latlng) + ',' + encodeURI(city_max_latlng) + "&types=address,poi&limit=5&access_token=pk.eyJ1IjoiYm9ycmVjYWhiIiwiYSI6ImNsM2p4bGthcjBpcXUzaHFpb3Q5eG1sdDYifQ.8j9jswc_pAM2Lb2_Vn-qzw"
            $("#search_button").autocomplete({
                minLength : 3,
                source: function (request, response) {
                    $.ajax({
                        type: 'GET',
                        url: url,
                        dataType: 'json',
                        cors: true ,
                        contentType:'application/json',
                        secure: true,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                        },
                        beforeSend: function(){
                        },
                        success: function (data) {
                            var address = [];
                            $(data.features).each(function(){
                                address.push($(this)[0].place_name);
                            })
                            response(address);
                        },
                        error: function(data) {
                        }
                    });
                },
                select: function(event, ui) {
                    if(search_on === 0){
                        map.dragging.enable();
                        map.touchZoom.enable();
                        map.doubleClickZoom.enable();
                        map.scrollWheelZoom.enable();
                        map.boxZoom.enable();
                        map.keyboard.enable();
                        $(".openstreetmap_iframe").removeClass("openstreetmap_iframe_off");
                        $(".how_to_use_map_1").fadeTo("slow", 0);
                        setTimeout(function(){
                            $(".how_to_use_map_1").addClass('d-none opacity_0');
                            // $(".help_book_container .help_book_hover").removeClass('fa-xmark');
                            // $(".help_book_container .help_book_hover").addClass('fa-question');
                        }, 1000);
                        if(count_help === 0){
                            setTimeout(function(){
                                $(".help_button").fadeTo("slow", 1);
                                $(".help_button").removeClass('opacity_0 d-none pe-none');
                                $(".location_button").fadeTo("slow", 1);
                                $(".location_button").removeClass('opacity_0 d-none pe-none');
                                $(".how_to_use_map_2").fadeTo("slow", 1);
                                $(".how_to_use_map_2").removeClass('opacity_0 d-none');
                            }, 500);
                            count_help = 1;
                        }

                    }
                    if(ui.item){
                        $('#search_button').val(ui.item.value);
                    }
                    if(search_on === 1){
                        map.removeLayer(marker);
                        map.removeLayer(circle);
                    }
                    let search = $('#search_button').val();
                    $('#address_poi_input').val(search);
                    $('#radius_input').val((budget + 1500));
                    let min_latlng_array = city_latlng_min.split(',');
                    let max_latlng_array = city_latlng_max.split(',');
                    let min_latlng = min_latlng_array[1] + ',' + min_latlng_array[0];
                    let max_latlng = max_latlng_array[1] + ',' + max_latlng_array[0];
                    let city_min_latlng = min_latlng;
                    let city_max_latlng = max_latlng;
                    let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURI(search) + ".json?bbox=" + encodeURI(city_min_latlng) + ',' + encodeURI(city_max_latlng) + "&types=address,poi&limit=5&access_token=pk.eyJ1IjoiYm9ycmVjYWhiIiwiYSI6ImNsM2p4bGthcjBpcXUzaHFpb3Q5eG1sdDYifQ.8j9jswc_pAM2Lb2_Vn-qzw"
                    $.ajax({
                        type: 'GET',
                        url: url,
                        dataType: 'json',
                        cors: true ,
                        contentType:'application/json',
                        secure: true,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                        },
                        beforeSend: function(){
                        },
                        success: function (data) {
                            zoneIn = [];
                            zoneOut = [];
                            nameZone = [];
                            map.removeLayer(geojson);
                            geojson = L.geoJson(geojson_name, {
                                style: style,
                                onEachFeature: onEachFeature
                            }).addTo(map);
                            $(deleteButton).fadeTo("slow", 1);
                            $(deleteButton).attr('style', '');
                            if(data.features.length > 0){
                                let name = data.features[0].place_name;
                                lat = data.features[0].center[0];
                                lng = data.features[0].center[1];
                                marker = new L.Marker([lng, lat], {
                                    icon: L.divIcon({
                                        className: 'leaflet-mouse-marker',
                                        iconAnchor: [1, 1],
                                        iconSize: [1, 1]
                                    })
                                }).addTo(map);
                                circle = L.circle([lng, lat], {
                                    color: '#078ba8',
                                    fillColor: '#8cc9cb',
                                    fillOpacity: 0.4,
                                    radius: Number(budget + 1500),
                                }).addTo(map);
                                $('#add_circle').attr('style', 'display:none;');
                                $('#delete_circle').attr('style', 'display:block;');
                                circle.editing.enable();
                                marker_circle = L.layerGroup([marker, circle]);
                                map.addLayer(marker_circle);
                                if(search_on === 0){
                                    search_on = 1;
                                }
                                for(var key in zoneAll._layers) {
                                    let coordinates = zoneAll._layers[key].feature.geometry.coordinates[0];
                                    let counter_c = 0;
                                    for(i=0;i<coordinates.length;i++){
                                        let lat_c = coordinates[i][0];
                                        let lng_c = coordinates[i][1];
                                        let marker_test = new L.Marker([lng_c, lat_c]);
                                        var d = map.distance(marker_test.getLatLng(), circle.getLatLng());
                                        var isInside = d < circle.getRadius();
                                        if(isInside){
                                            counter_c++;
                                        }
                                    }
                                    if(counter_c >= (coordinates.length / 2)){
                                        nameZone.push(zoneAll._layers[key].feature.properties.name);
                                    }

                                }
                                let id = [];
                                $('.zone_click').attr('style', 'fill-opacity:0.7;');
                                $('#fav_zone_div').find('.btn_book_zone').remove();
                                let zone_val = '';
                                $(".zone").removeClass("zone_click");
                                for(let key in geojson._layers){
                                    fadeInLayerLeaflet(geojson._layers[key], geojson._layers[key].options.opacity, 1, 0.3, 0.3, 0.1, 100);
                                    if(nameZone.includes(geojson._layers[key].feature.properties.name)){
                                        id.push(geojson._layers[key]._leaflet_id);
                                        let price_border = '';
                                        if(!(geojson._layers[key].feature.properties.color === 'rosso')){
                                            $('#fav_zone_div').append('<button type="button" class="btn_book_zone ' + geojson._layers[key].feature.properties.color + ' btn_book btn_bg_first mb-2 px-2" style="border:' + price_border + ';" data-leaflet-id="' + geojson._layers[key]._leaflet_id + '" data-id="' + geojson._layers[key].feature.id + '">' + geojson._layers[key].feature.properties.name + ': ' + geojson._layers[key].feature.properties.budget + '€</button>');
                                            if(zone_val != ''){
                                                zone_val = zone_val + ',' + geojson._layers[key].feature.properties.name;
                                            } else {
                                                zone_val = geojson._layers[key].feature.properties.name;
                                            }
                                            geojson._layers[key].setStyle({
                                                fillColor: '#7DD87D',
                                                weight: 2,
                                                opacity: 1,
                                                color: 'green',
                                                dashArray: '1',
                                                fillOpacity: 0.5
                                            });
                                            geojson._layers[key].setStyle({className: 'zone zone_click verde'});
                                            geojson._layers[key].feature.properties.color = 'verde';
                                            zoneIn.push(geojson._layers[key].feature.properties.name);
                                        }

                                    } else {
                                        geojson._layers[key].setStyle({
                                            fillColor: '#f6b9b3',
                                        weight: 2,
                                        opacity: 1,
                                        color: '#87919E',
                                        dashArray: '1',
                                        fillOpacity: 0.5
                                        });
                                        geojson._layers[key].setStyle({className: 'rosso'});
                                        geojson._layers[key].feature.properties.color = 'rosso';
                                        zoneOut.push(geojson._layers[key].feature.properties.name);
                                    }
                                }
                                map.removeLayer(geojson);
                                geojson = L.geoJson(geojson_name, {
                                    style: style,
                                    onEachFeature: onEachFeature
                                }).addTo(map);
                                let zones = zone_val.split(',');
                                searchAndSelectZone(zones,geojson);
                                $('#fav_zone_div').removeClass('d-none');
                                $('.leaflet-edit-move').html('<div class="hover_move">Move the circle around your interest point</div>');
                                $('.leaflet-edit-resize').html('<div class="hover_resize">Resize the circle around your interest point</div>');
                                marker.bindPopup(name).openPopup();
                                circle.on('editdrag', function(event){
                                    zoneIn = [];
                                    zoneOut = [];
                                    nameZone = [];
                                    map.removeLayer(geojson);
                                    geojson = L.geoJson(geojson_name, {
                                        style: style,
                                        onEachFeature: onEachFeature
                                    }).addTo(map);
                                    if (marker) {
                                        map.removeLayer(marker);
                                    }
                                    let radius = this._mRadius;
                                    let new_pos = event.target.getLatLng();
                                    let new_pos_lat = new_pos.lat;
                                    let new_pos_lng = new_pos.lng;
                                    marker = new L.Marker(new_pos, {
                                        icon: L.divIcon({
                                            className: 'leaflet-mouse-marker',
                                            iconAnchor: [1, 1],
                                            iconSize: [1, 1]
                                        })
                                    });
                                    marker_circle = L.layerGroup([marker, circle]);
                                    map.addLayer(marker_circle);
                                    for(var key in zoneAll._layers) {
                                        let coordinates = zoneAll._layers[key].feature.geometry.coordinates[0];
                                        let counter_c = 0;
                                        for(i=0;i<coordinates.length;i++){
                                            let lat_c = coordinates[i][0];
                                            let lng_c = coordinates[i][1];
                                            let marker_test = new L.Marker([lng_c, lat_c]);
                                            var d = map.distance(marker_test.getLatLng(), circle.getLatLng());
                                            var isInside = d < circle.getRadius();
                                            if(isInside){
                                                counter_c++;
                                            }
                                        }
                                        if(counter_c >= (coordinates.length / 2)){
                                            nameZone.push(zoneAll._layers[key].feature.properties.name);
                                        }
                                    }
                                    let id = [];
                                    $('.zone_click').attr('style', 'fill-opacity:0.7;');
                                    $('#fav_zone_div').find('.btn_book_zone').remove();
                                    let zone_val = '';
                                    $(".zone").removeClass("zone_click");
                                    for(let key in geojson._layers){
                                        fadeInLayerLeaflet(geojson._layers[key], geojson._layers[key].options.opacity, 1, 0.3, 0.3, 0.1, 100);
                                        if(nameZone.includes(geojson._layers[key].feature.properties.name)){
                                            id.push(geojson._layers[key]._leaflet_id);
                                            let price_border = '';
                                            if(!(geojson._layers[key].feature.properties.color === 'rosso')){
                                                $('#fav_zone_div').append('<button type="button" class="btn_book_zone ' + geojson._layers[key].feature.properties.color + ' btn_book btn_bg_first mb-2 px-2" style="border:' + price_border + ';" data-leaflet-id="' + geojson._layers[key]._leaflet_id + '" data-id="' + geojson._layers[key].feature.id + '">' + geojson._layers[key].feature.properties.name + ': ' + geojson._layers[key].feature.properties.budget + '€</button>');
                                                if(zone_val != ''){
                                                    zone_val = zone_val + ',' + geojson._layers[key].feature.properties.name;
                                                } else {
                                                    zone_val = geojson._layers[key].feature.properties.name;
                                                }
                                                geojson._layers[key].setStyle({
                                                    fillColor: '#7DD87D',
                                                    weight: 2,
                                                    opacity: 1,
                                                    color: 'green',
                                                    dashArray: '1',
                                                    fillOpacity: 0.5
                                                });
                                                geojson._layers[key].setStyle({className: 'zone zone_click verde'});
                                                geojson._layers[key].feature.properties.color = 'verde';
                                                zoneIn.push(geojson._layers[key].feature.properties.name);
                                            }

                                        } else {
                                            geojson._layers[key].setStyle({
                                                fillColor: '#A4B8C4',
                                                weight: 2,
                                                opacity: 1,
                                                color: '#87919E',
                                                dashArray: '1',
                                                fillOpacity: 0.3
                                            });
                                            geojson._layers[key].setStyle({className: 'rosso'});
                                            geojson._layers[key].feature.properties.color = 'rosso';
                                            zoneOut.push(geojson._layers[key].feature.properties.name);
                                        }
                                    }
                                    map.removeLayer(geojson);
                                    geojson = L.geoJson(geojson_name, {
                                        style: style,
                                        onEachFeature: onEachFeature
                                    }).addTo(map);
                                    let zones = zone_val.split(',');
                                    searchAndSelectZone(zones,geojson);
                                    $('#fav_zone_div').removeClass('d-none');
                                    let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + new_pos_lng + ',' + new_pos_lat + ".json?types=address,poi&limit=1&access_token=pk.eyJ1IjoiYm9ycmVjYWhiIiwiYSI6ImNsM2p4bGthcjBpcXUzaHFpb3Q5eG1sdDYifQ.8j9jswc_pAM2Lb2_Vn-qzw"
                                    $.ajax({
                                        type: 'GET',
                                        url: url,
                                        dataType: 'json',
                                        cors: true ,
                                        contentType:'application/json',
                                        secure: true,
                                        headers: {
                                            'Access-Control-Allow-Origin': '*',
                                        },
                                        beforeSend: function(){
                                        },
                                        success: function (data) {
                                            let new_address = data.features[0].place_name;
                                            $('#radius_input').val(radius);
                                            $('#address_poi_input').val(new_address);
                                            $('#search_button').val(new_address);
                                            marker.bindPopup(new_address).openPopup();
                                        },
                                        error: function(data) {
                                        }
                                    });
                                });
                            }
                        },
                        error: function(data) {
                        }
                    });
                }
            });
        }

    });

    $(".budget_range_test").on("change", function(){
        let form = $(this).data("form");
        let url = $(this).data("url");
        let val = $(this).data("val");
        let value = Number($(val).html());
        $(this).val(value);
        let data = $(form).serialize();
        $.ajax({
			url: url,
			method: "POST",
			data: data,
			success: function(data) {
			    budget = Number($(data)[2].innerHTML);
                $("#budgetMap").html(budget);
                map.removeLayer(geojson);
                selected_zones = nameZone.toString();
                if(selected_zones != ''){
                    let zones = selected_zones.split(',');
                    geojson = L.geoJson(geojson_name, {
                        style: style,
                        onEachFeature: onEachFeature
                    }).addTo(map);
                    for(var key in geojson._layers) {
                        fadeInLayerLeaflet(geojson._layers[key], geojson._layers[key].options.opacity, 1, 0.3, 0.3, 0.1, 100);
                    }
                    searchAndSelectZone(zones,geojson);
                } else {
                    geojson = L.geoJson(geojson_name, {
                        style: style_start
                    }).addTo(map);
                    for(var key in geojson._layers) {
                        fadeInLayerLeaflet(geojson._layers[key], geojson._layers[key].options.opacity, 1, 0.3, 0.3, 0.1, 100);
                    }
                    $(deleteButton).attr("style", "pointer-events:none;opacity:0;");
                    $(".zone_found").text(0);
                }
			}
		});
    });

});
