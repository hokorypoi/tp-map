
const Cesium = window.Cesium;
let viewerObject; // Store the viewer object
let roadEntities = []; // Store road entities

/**
 * 添加线路
 */
function addRoad(roadData) {
  const viewer = viewerObject; // Use the stored viewer object
  // Implementation for adding road
  // For example, you can create a polyline entity based on the roadData
  const roadEntity = viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray(roadData.coordinates),
      width: 5,
      material: Cesium.Color.RED,
    },
  });
  roadEntities.push(roadEntity); // Store the created road entity
}

/**
 * 删除线路
 */
function removeRoad(roadEntity) {
  const viewer = viewerObject;
  viewer.entities.remove(roadEntity);
  roadEntities = roadEntities.filter(entity => entity !== roadEntity); // Remove from the stored array
}

/**
 * 清除所有线路
 */
function clearAllRoads() {
  const viewer = viewerObject;
  roadEntities.forEach(entity => viewer.entities.remove(entity));
  roadEntities = []; // Clear the stored array
}

/**
 * 更新线路
 */
function updateRoad(roadEntity, newRoadData) {
  // Update the road entity's positions based on newRoadData
  roadEntity.polyline.positions = Cesium.Cartesian3.fromDegreesArray(newRoadData.coordinates);
  // update style or other properties if needed
  roadEntity.polyline.width = newRoadData.width;
  roadEntity.polyline.material = newRoadData.material;
}

/**
 * 批量添加线路
 */
function addRoads(roadsData) {
  roadsData.forEach(roadData => addRoad(roadData));
}

/**
 * 加载模型
 */
function loadModel(modelData) {
  // Implementation for loading model
  // For example, you can create a model entity based on the modelData
  const viewer = viewerObject;
  const modelEntity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(modelData.longitude, modelData.latitude, modelData.height),
    model: {
      uri: modelData.uri,
      scale: modelData.scale,
    },
  });
  return modelEntity; // Return the created model entity
}

/**
 * 播放线路轨迹动画
 */
function playRoadAnimation(roadEntity, animationData) {
  // Implementation for playing road animation
  // This could involve moving an entity along the roadEntity's path based on animationData
  // For example, you can use Cesium's SampledPositionProperty to animate a point along the road
  const viewer = viewerObject;
  const sampledPosition = new Cesium.SampledPositionProperty();

  animationData.forEach(point => {
    const time = Cesium.JulianDate.fromDate(new Date(point.time));
    const position = Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.height);
    sampledPosition.addSample(time, position);
  });

  const movingEntity = viewer.entities.add({
    position: sampledPosition,
    point: {
      pixelSize: 10,
      color: Cesium.Color.YELLOW,
    },
  });

  viewer.entities.add(movingEntity);

  // Optionally, you can set up a clock to control the animation playback
  viewer.clock.startTime = Cesium.JulianDate.fromDate(new Date(animationData[0].time));
  viewer.clock.stopTime = Cesium.JulianDate.fromDate(new Date(animationData[animationData.length - 1].time));
  viewer.clock.currentTime = viewer.clock.startTime;
  viewer.clock.multiplier = 1; // Adjust the speed of the animation
  viewer.clock.shouldAnimate = true;
}

const RoadController = {
  addRoad,
  removeRoad,
  clearAllRoads,
  updateRoad,
  addRoads,
  playRoadAnimation,
  loadModel,
};

export default RoadController;
