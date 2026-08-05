import MapController from '../controller/map-controller';

const turf = window.turf;

let layerIdCounter = 0;
let onMapLayerIds = [];
let showRouteLineObjects = true;

function addRouteLineAnimation(origin, destination) {
  const map = MapController.getMapObject();
  // San Francisco
  // const origin = [-122.414, 37.776];

  // // Washington DC
  // const destination = [-77.032, 38.913];

  // A simple line from origin to destination.
  const route = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [origin, destination]
        }
      }
    ]
  };

  // A single point that animates along the route.
  // Coordinates are initially set to origin.
  const point = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Point',
          'coordinates': origin
        }
      }
    ]
  };

  // Calculate the distance in kilometers between route start/end point.

  var from = turf.point(origin);
  var to = turf.point(destination);

  const lineDistance = turf.distance(from, to);
  console.log(lineDistance)

  const arc = [];

  // Number of steps to use in the arc and animation, more steps means
  // a smoother arc and animation, but too many steps will result in a
  // low frame rate
  const steps = 500;

  // Draw an arc between the `origin` & `destination` of the two points
  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    const segment = turf.along(route.features[0], i, 'kilometers');
    arc.push(segment.geometry.coordinates);
  }

  // Update the route with calculated arc coordinates
  route.features[0].geometry.coordinates = arc;

  // Used to increment the value of the point measurement against the route.
  let counter = 0;


  // Add a source and layer displaying a point which will be animated in a circle.
  map.addSource(`route-line-source-${layerIdCounter}`, {
    'type': 'geojson',
    'data': route
  });

  const pointLayerSourceId = `route-line-point-source-${layerIdCounter}`

  map.addSource(pointLayerSourceId, {
    'type': 'geojson',
    'data': point
  });

  const lId1 = `route-line-layer-${layerIdCounter}`;
  onMapLayerIds.push(lId1);

  map.addLayer({
    'id': lId1,
    'source': `route-line-source-${layerIdCounter}`,
    'type': 'line',
    'paint': {
      'line-width': 4,
      'line-color': '#bf0096',
      'line-opacity': 0.8,
      'line-dasharray': [3, 3]
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    }
  });

  const lId2 = `route-line-point-layer-${layerIdCounter}`
  onMapLayerIds.push(lId2);

  map.addLayer({
    'id': lId2,
    'source': pointLayerSourceId,
    'type': 'symbol',
    'layout': {
      'icon-image': 'cat',
      'icon-rotate': ['get', 'bearing'],
      'icon-rotation-alignment': 'map',
      'icon-overlap': 'always',
      'icon-ignore-placement': true
    }
  });

  layerIdCounter++;

  function animate() {
    // Update point geometry to a new position based on counter denoting
    // the index to access the arc.
    point.features[0].geometry.coordinates =
      route.features[0].geometry.coordinates[counter];

    // Calculate the bearing to ensure the icon is rotated to match the route arc
    // The bearing is calculate between the current point and the next point, except
    // at the end of the arc use the previous point and the current point
    point.features[0].properties.bearing = turf.bearing(
      turf.point(
        route.features[0].geometry.coordinates[
        counter >= steps ? counter - 1 : counter
        ]
      ),
      turf.point(
        route.features[0].geometry.coordinates[
        counter >= steps ? counter : counter + 1
        ]
      )
    );

    // Update the source with this new data.
    if (map.getSource(pointLayerSourceId)) {
      map.getSource(pointLayerSourceId).setData(point);
    }
    // Request the next frame of animation so long the end has not been reached.
    if (counter < steps) {
      requestAnimationFrame(animate);
    } else {
      rePlay();
    }

    counter = counter + 1;
  }

  function rePlay() {
    // Set the coordinates of the original point back to origin
    point.features[0].geometry.coordinates = origin;

    // Update the source layer
    map.getSource(pointLayerSourceId) && map.getSource(pointLayerSourceId).setData(point);

    // Reset the counter
    counter = 0;

    // Restart the animation.
    animate(counter);
  }
  // Start the animation.
  animate(counter);

}


function toggleRouteLineObjects(show) {
  const toShow = show === undefined ? !showRouteLineObjects : show;
  const map = MapController.getMapObject();
  onMapLayerIds.forEach(layerId => {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(
        layerId,
        'visibility',
        toShow ? 'visible' : 'none'
      );
    }
  })
  showRouteLineObjects = !showRouteLineObjects;
}


const RouteLineService = {
  addRouteLineAnimation,
  toggleRouteLineObjects,

}

export default RouteLineService;
