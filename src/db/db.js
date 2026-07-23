// db.js
import { Dexie } from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
  roads: '++id, name, coordinates', // Primary key and indexed props
});

async function addRoad(name, coordinates) {
  return db.roads.add({ name, coordinates });
}

function getAllRoads() {
  return db.roads.toArray();
}

async function deleteRoad(id) {
  return db.roads.delete(id);
}

const DbInstance = {
  addRoad,
  getAllRoads,
  deleteRoad,
};

export default DbInstance;

