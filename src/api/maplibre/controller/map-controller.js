import { Map, setWorkerUrl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import AddLayerService from '../service/add-layer-service';
import RouteLineService from '../service/route-line-service';
import PulsingDotService from '../service/pulsing-dot-service'

setWorkerUrl(workerUrl)

const mapCenter = [116.77537345429118, 38.699435252482004];

let map;


function initMap() {
  map = new Map({
    container: 'maplibreMap', // container id
    zoom: 7,
    center: mapCenter,
    style: {
      version: 8,
      sources: {
        satellite: {
          type: 'raster',
          tiles: ['https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'],
          // tiles: [
          //   'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg',
          // ],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'satellite',
          type: 'raster',
          source: 'satellite',
        },
      ],
    },
  })

  // The `click` event is an example of a `MapMouseEvent`.
  // Set up an event listener on the map.
  map.on('click', (e) => {
    // The event object (e) contains information like the
    // coordinates of the point on the map that was clicked.
    console.log('A click event has occurred at ' + e.lngLat);
  });

  map.on('load', async () => {

    const image = await map.loadImage('./static/imgs/avatar/plane_blue_48.png');
    map.addImage('cat', image.data);

    AddLayerService.addCircle({ center: mapCenter, radius: 200 })

    AddLayerService.addLine({ coordinates: AddLayerService.lineZHongL, color: '#e64a19' });
    AddLayerService.addLine({ coordinates: AddLayerService.lineZLaiL, color: '#ffea00' });
    AddLayerService.addLine({ coordinates: AddLayerService.lineZLiuL, color: '#2962ff' });

    AddLayerService.addLine({ coordinates: AddLayerService.lineAnSiYanLiu, color: '#e64a19' });
    AddLayerService.addLine({ coordinates: AddLayerService.lineYanLiuFanQi, color: '#ffea00' });
    AddLayerService.addLine({ coordinates: AddLayerService.lineFanQi233, color: '#2962ff' });


    const dest1 = [115.92739762997735, 39.67915524950158];
    const dest2 = [116.54400374777367, 40.28781011167746];

    RouteLineService.addRouteLineAnimation(mapCenter, dest1);
    RouteLineService.addRouteLineAnimation(mapCenter, dest2);

    PulsingDotService.addPulsingDotAnimation(mapCenter, 160, 500, '76, 175, 80');
    PulsingDotService.addPulsingDotAnimation(dest1, 160, 500);
    PulsingDotService.addPulsingDotAnimation(dest2, 160, 500);

    // new Popup({ closeOnClick: false, closeButton: false })
    //   .setLngLat(mapCenter)
    //   .setHTML('')
    //   .addTo(map);

  })
}

function getMapObject() {
  return map;
}


const MapController = {
  initMap,
  getMapObject,
}

export default MapController;

