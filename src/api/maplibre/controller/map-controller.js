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

let mapOnMapMoveEndEvents = {};


function initMap() {

  const { center = [], basemaps = [], basemapIndex = 0 } = window.appMaplibreConf;
  mapCenter = center;

  map = new Map({
    container: 'maplibreMap', // container id
    zoom: 7,
    center: mapCenter,
    style: basemaps[basemapIndex].style,
    minZoom: 1,
    maxZoom: 24,
    canvasContextAttributes: { antialias: true } // create the gl context with MSAA antialiasing, so custom layers are antialiased
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
    renderLayers();

    // new Popup({ closeOnClick: false, closeButton: false })
    //   .setLngLat(mapCenter)
    //   .setHTML('')
    //   .addTo(map);

  })


  // map.on('style.load', () => {
  //   map.setProjection({
  //     type: 'globe', // Set projection to globe | mercator
  //   });
  // });


  map.on('moveend', onMapViewportStateChanged);
}

function addEventToMapMoveEnd(key, event) {
  mapOnMapMoveEndEvents[key] = event;
}

function removeEventFromMapMoveEnd(key) {
  delete mapOnMapMoveEndEvents[key];
}

function onMapViewportStateChanged() {
  const { zoom, center } = getMapViewportInfo();
  for (const key in mapOnMapMoveEndEvents) {
    const fn = mapOnMapMoveEndEvents[key];
    fn({ zoom, center });
  }
}

async function renderLayers() {

  dataList = [];
  dataHash = {};

  const { list = [] } = window.appMaplibreConf

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
      el.style.width = `56px`;
      el.style.height = `56px`;

      el.addEventListener('click', () => {
        console.log('click')
      });

      // add marker to map
      new Marker({ element: el })
        .setLngLat(node.coordinates)
        .addTo(map);
    }
  });
}

function getMapObject() {
  return map;
}

function getDataList() {
  return dataList.map(r => ({ label: r.name, id: r.id, type: r.type, lines: r.lines }))
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

function flyToLine(line) {
  const lineO = turf.lineString(line.coordinates);
  const bbox = turf.bbox(lineO);
  map.fitBounds(bbox, {
    padding: { top: 80, bottom: 80, left: 80, right: 80 }
  })
}

function goHome() {
  map.flyTo({ center: mapCenter, zoom: 7 })
}

function getBasemapData() {
  const { basemaps = [], basemapIndex = 0 } = window.appMaplibreConf;
  return {
    index: basemapIndex,
    list: basemaps.map(r => ({ name: r.name, icon: r.icon, style: r.style }))
  }
}

function setBasemap(index) {
  const { basemaps = [] } = window.appMaplibreConf
  const style = basemaps[index].style;
  // const oldStyle = map.getStyle();
  // const keyWord = 'basemap_';

  // let newLayers = style.layers.slice();

  // oldStyle.layers.forEach(layer => {
  //   const { id } = layer;
  //   if (id.indexOf(keyWord) === -1) {
  //     newLayers.push(layer);
  //   }
  // })

  // let newSources = {
  //   ...style.sources,
  // }

  // for (const id in oldStyle.sources) {
  //   if (id.indexOf(keyWord) === -1) {
  //     newSources[id] = oldStyle.sources[id]
  //   }
  // }

  // let newStyle = {
  //   ...oldStyle,
  //   layers: newLayers,
  //   sources: newSources
  // }

  // map.setStyle(newStyle, { diff: false });
  map.setStyle(style);
  renderLayers();
}

function getMapViewportInfo() {
  const zoom = map.getZoom();
  const center = map.getCenter();
  return { zoom, center };
}

const MapController = {
  initMap,
  getMapObject,
  getDataList,
  toggleBufferCircle: AddLayerService.toggleBufferCircle,
  toggleRouteLineObjects: RouteLineService.toggleRouteLineObjects,
  togglePulsingDotObjects: PulsingDotService.togglePulsingDotObjects,
  flyToById,
  flyToLine,
  getDataById,
  goHome,
  getBasemapData,
  setBasemap,
  getMapViewportInfo,
  removeEventFromMapMoveEnd,
  addEventToMapMoveEnd,
}

export default MapController;

