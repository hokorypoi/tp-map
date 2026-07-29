import MapController from '../controller/map-controller';

let layerIdCounter = 0;

function addPulsingDotAnimation(point, size = 200, duration = 1000, colorRGB = '255, 100, 100') {
  const map = MapController.getMapObject();

  // implementation of StyleImageInterface to draw a pulsing dot icon on the map
  // Search for StyleImageInterface in https://maplibre.org/maplibre-gl-js/docs/API/
  const pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // get rendering context for the map canvas when layer is added to the map
    onAdd() {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
    },

    // called once before every frame where the icon will be used
    render() {
      const t = (performance.now() % duration) / duration;

      const radius = (size / 2) * 0.3;
      const outerRadius = (size / 2) * 0.7 * t + radius;
      const context = this.context;

      // draw outer circle
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        outerRadius,
        0,
        Math.PI * 2
      );
      context.fillStyle = `rgba(${colorRGB},${1 - t})`;
      context.fill();

      // draw inner circle
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        radius,
        0,
        Math.PI * 2
      );
      context.fillStyle = `rgba(${colorRGB},${1 - t})`;
      context.strokeStyle = 'white';
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();

      // update this image's data with data from the canvas
      this.data = context.getImageData(
        0,
        0,
        this.width,
        this.height
      ).data;

      // continuously repaint the map, resulting in the smooth animation of the dot
      map.triggerRepaint();

      // return `true` to let the map know that the image was updated
      return true;
    }
  };

  const imageId = `pulsing-dot-image-${layerIdCounter}`

  map.addImage(imageId, pulsingDot, { pixelRatio: 2 });

  const sourceId = `pulsing-dot-source-${layerIdCounter}`;

  map.addSource(sourceId, {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': point
          }
        }
      ]
    }
  });
  map.addLayer({
    'id': `pulsing-dot-layer-${layerIdCounter}`,
    'type': 'symbol',
    'source': sourceId,
    'layout': {
      'icon-image': imageId
    }
  });

  layerIdCounter++;

}

const PulsingDotService = {
  addPulsingDotAnimation,
}

export default PulsingDotService;
