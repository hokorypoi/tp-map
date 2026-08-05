const turf = window.turf;

import MapController from '../controller/map-controller';

let layerIdCounter = 0;
let showBufferCircle = true;
const fillId = 'location-radius';
const layerId = `location-radius-outline`

let flashInterval;

function addCircle({ center, radius = 10 }) {
  const map = MapController.getMapObject();

  const options = {
    steps: 64,
    units: 'kilometers'
  };

  const circle = turf.circle(center, radius, options);

  // Add the circle as a GeoJSON source
  map.addSource('location-radius', {
    type: 'geojson',
    data: circle
  });

  // Add a fill layer with some transparency

  map.addLayer({
    id: fillId,
    type: 'fill',
    source: 'location-radius',
    paint: {
      'fill-color': '#ff00c8',
      'fill-opacity': 0.05
    }
  });



  // Add a line layer to draw the circle outline
  map.addLayer({
    id: layerId,
    type: 'line',
    source: 'location-radius',
    paint: {
      'line-color': '#ff004c',
      'line-opacity': 0.6,
      'line-width': 3,
      'line-dasharray': [3, 3]
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    }
  });

  let flag = false;

  if (flashInterval) {
    clearInterval(flashInterval);
  }

  flashInterval = setInterval(() => {
    if (showBufferCircle) {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          'visibility',
          flag ? 'visible' : 'none'
        );
      }
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          fillId,
          'visibility',
          flag ? 'visible' : 'none'
        );
      }
      flag = !flag;
    }
  }, 500);

}

function toggleBufferCircle(show) {
  const toShow = show === undefined ? !showBufferCircle : show;
  const map = MapController.getMapObject();
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(
      layerId,
      'visibility',
      toShow ? 'visible' : 'none'
    );
  }
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(
      fillId,
      'visibility',
      toShow ? 'visible' : 'none'
    );
  }
  showBufferCircle = !showBufferCircle;
}

function addLine({ coordinates, color = '#ff4d4f' }) {
  const map = MapController.getMapObject();
  const sid = `road-line-source-${layerIdCounter}`
  const lid = `road-line-layer-${layerIdCounter}`
  map.addSource(sid, {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates,
      },
    },
  })
  map.addLayer({
    id: lid,
    type: 'line',
    source: sid,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': color,
      'line-width': 6,
      'line-opacity': 0.8,
    },
  })
  layerIdCounter++;
}


const AddLayerService = {
  addCircle,
  toggleBufferCircle,
  addLine,
}

export default AddLayerService;
