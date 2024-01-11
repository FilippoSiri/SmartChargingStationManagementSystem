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
        function addMarker(lng, lat, customElem) {
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
        }

        // create the map
        tt.setProductInfo('TomTom Maps React Native Demo', '1.0');
        let map = tt.map({
            key: 'AyeWrrVkSc9LAI0nqUQqB91xpIbM4SYy',
            container: 'map',
            center: [8.93413, 44.40757],
            zoom: 16
        });
        
        map.on('dragend', function() {
            let center = map.getCenter();
            window.ReactNativeWebView.postMessage(center.lng.toFixed(3) + ", " + center.lat.toFixed(3));
        })
    </script>
</div>
`;