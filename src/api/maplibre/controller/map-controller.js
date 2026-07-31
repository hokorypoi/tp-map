import { Map, setWorkerUrl, Marker } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import AddLayerService from '../service/add-layer-service';
import RouteLineService from '../service/route-line-service';
import PulsingDotService from '../service/pulsing-dot-service'

const turf = window.turf;

setWorkerUrl(workerUrl)

let mapCenter;

let map;

let dataList = [];
let dataHash = {};


function initMap() {

  const { center = [], list = [] } = window.appMaplibreConf;
  mapCenter = center;

  map = new Map({
    container: 'maplibreMap', // container id
    zoom: 7,
    center: mapCenter,
    style: {
      version: 8,
      sources: {
        satellite: {
          type: 'raster',
          tiles: ['https://b.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'],
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
    PulsingDotService.addPulsingDotAnimation(mapCenter, 160, 500, '76, 175, 80');

    list.forEach((node, index) => {
      const { type } = node;
      const id = `${index}`;
      dataList.push({
        ...node,
        id
      })
      dataHash[id] = node;
      if (type === 'line') {

        const { lines = [], startPoint = [] } = node;
        lines.forEach(line => {
          const { coordinates, color } = line;
          AddLayerService.addLine({ coordinates: coordinates, color: color });
        })

        RouteLineService.addRouteLineAnimation(mapCenter, startPoint);
        PulsingDotService.addPulsingDotAnimation(startPoint, 160, 500);
      }
      if (type === 'point') {
        // create a DOM element for the marker
        const el = document.createElement('div');
        el.className = 'maplibre-marker';
        el.style.backgroundImage =
          `url('${node.icon || "./static/imgs/avatar/rikka.gif"}')`;
        el.style.width = `64px`;
        el.style.height = `64px`;

        el.addEventListener('click', () => {
          console.log('click')
        });

        // add marker to map
        new Marker({ element: el })
          .setLngLat(node.coordinates)
          .addTo(map);
      }
    });

    // new Popup({ closeOnClick: false, closeButton: false })
    //   .setLngLat(mapCenter)
    //   .setHTML('')
    //   .addTo(map);

  })
}

function getMapObject() {
  return map;
}

function getDataList() {
  return dataList.map(r => ({ label: r.name, id: r.id }))
}

function getDataById(id) {
  return dataHash[id];
}

function flyToById(id) {
  const data = dataHash[id];
  const { type } = data;
  switch (type) {
    case 'line':
      {
        const { lines = [] } = data;
        const multiLine = turf.multiLineString(lines.map(r => r.coordinates));
        const bbox = turf.bbox(multiLine);
        map.fitBounds(bbox, {
          padding: { top: 80, bottom: 80, left: 80, right: 80 }
        })
      }
      break;
    case 'point':
      map.flyTo({ center: data.coordinates, zoom: 9 });
      break;
    default:
  }

}

function goHome() {
  map.flyTo({ center: mapCenter, zoom: 7 })
}


const MapController = {
  initMap,
  getMapObject,
  getDataList,
  toggleBufferCircle: AddLayerService.toggleBufferCircle,
  toggleRouteLineObjects: RouteLineService.toggleRouteLineObjects,
  togglePulsingDotObjects: PulsingDotService.togglePulsingDotObjects,
  flyToById,
  getDataById,
  goHome,
}

export default MapController;

