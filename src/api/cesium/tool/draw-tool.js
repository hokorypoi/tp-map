import DialogTool from '@/tool/dialog-tool'

const Cesium = window.Cesium;

let handler;
let activeShapePoints = [];
let activeShape;
let floatingPoint;
let cartographicPositions;

/**
 * 启用绘制工具
 * @param {*} viewer
 */
function initDrawTool(viewer) {
  disableDrawTool();
  // Disable the default left double click zoom behavior.
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    Cesium.ScreenSpaceEventType.RIGHT_CLICK,
  );

  function createPoint(worldPosition) {
    const point = viewer.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 5,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
    return point;
  }
  let drawingMode = "line";
  function drawShape(positionData) {
    let shape;
    if (drawingMode === "line") {
      shape = viewer.entities.add({
        polyline: {
          positions: positionData,
          clampToGround: true,
          width: 3,
        },
      });
    } else if (drawingMode === "polygon") {
      shape = viewer.entities.add({
        polygon: {
          hierarchy: positionData,
          material: new Cesium.ColorMaterialProperty(
            Cesium.Color.WHITE.withAlpha(0.7),
          ),
        },
      });
    }
    return shape;
  }
  handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  handler.setInputAction(function (event) {
    // We use `viewer.scene.globe.pick here instead of `viewer.camera.pickEllipsoid` so that
    // we get the correct point when mousing over terrain.
    const ray = viewer.camera.getPickRay(event.position);
    const earthPosition = viewer.scene.globe.pick(ray, viewer.scene);
    // `earthPosition` will be undefined if our mouse is not over the globe.
    if (Cesium.defined(earthPosition)) {
      if (activeShapePoints.length === 0) {
        floatingPoint = createPoint(earthPosition);
        activeShapePoints.push(earthPosition);
        const dynamicPositions = new Cesium.CallbackProperty(function () {
          if (drawingMode === "polygon") {
            return new Cesium.PolygonHierarchy(activeShapePoints);
          }
          return activeShapePoints;
        }, false);
        activeShape = drawShape(dynamicPositions);
      }
      activeShapePoints.push(earthPosition);
      createPoint(earthPosition);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction(function (event) {
    if (Cesium.defined(floatingPoint)) {
      const ray = viewer.camera.getPickRay(event.endPosition);
      const newPosition = viewer.scene.globe.pick(ray, viewer.scene);
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition);
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  // Redraw the shape so it's not dynamic and remove the dynamic shape.
  function terminateShape() {
    activeShapePoints.pop();
    drawShape(activeShapePoints);
    console.log("绘制完成");
    console.log(activeShapePoints);
    // 转换为经纬度坐标
    cartographicPositions = activeShapePoints.map((position) => {
      const cartographic = Cesium.Cartographic.fromCartesian(position);
      return {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height,
      };
    });
    console.log("经纬度坐标：", cartographicPositions);
    setTimeout(() => {
      DialogTool.showDialog("绘制完成", JSON.stringify(cartographicPositions, null, 2));
    }, 100);
    // 清除绘制的图形
    viewer.entities.remove(floatingPoint);
    viewer.entities.remove(activeShape);
    floatingPoint = undefined;
    activeShape = undefined;
    activeShapePoints = [];
    disableDrawTool();
  }
  handler.setInputAction(function () {
    terminateShape();
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

}

/**
 * 停用绘制工具
 * @param {*} viewer
 */
function disableDrawTool() {
  if (handler) {
    handler.destroy();
    handler = null;
  }
}

const DrawTool = {
  initDrawTool,
  disableDrawTool,
};

export default DrawTool;
