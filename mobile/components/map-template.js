import { TOMTOM_API_KEY } from '@env';
export default `
<div>
    <style>
            html, body {
                margin: 0;
            }

            #map {
                height: 100%;
                width: 100%;
            }
    </style>
    
    <div id='map' class='map'></div>

    <!-- load TomTom Maps Web SDK from CDN -->
    <link rel='stylesheet' type='text/css' href='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.13.0/maps/maps.css'/>
    <script src='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.13.0/maps/maps-web.min.js'></script>

    <script>
        function addMarker(lng, lat, id, customElem) {
            let popupOffsets = {
                top: [0, 0],
                bottom: [0, -70],
                "bottom-right": [0, -70],
                "bottom-left": [0, -70],
                left: [25, -35],
                right: [-25, -35],
            };

            console.log("yuppe");

            let marker = new tt.Marker().setLngLat([lng, lat]).addTo(map);
            let popup = new tt.Popup({ offset: popupOffsets }).setHTML(customElem);
            marker.setPopup(popup);
 
            marker.getElement().addEventListener('click', function (e) {
                let msg = JSON.stringify({type: "marker_click", id: id});
                window.ReactNativeWebView.postMessage(msg);
            });
        }

        // create the map
        tt.setProductInfo('TomTom Maps React Native Demo', '1.0');
        let map = tt.map({
            key: '${TOMTOM_API_KEY}',
            container: 'map',
            center: [8.93413, 44.40757],
            zoom: 16
        });
        
        map.on('dragend', function() {
            let center = map.getCenter();
            let msg = JSON.stringify({type: "drag_map", lon: center.lng.toFixed(3), lat: center.lat.toFixed(3)});
            window.ReactNativeWebView.postMessage(msg);
        });

        map.on('dragstart', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({type: "drag_start"}));
        });
    </script>
</div>
`;
