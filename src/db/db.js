// db.js
import { Dexie } from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
  roads: '++id, name, coordinates, model_id', // Primary key and indexed props
});

async function addRoad({ name, coordinates, model_id }) {
  return db.roads.add({ name, coordinates, model_id });
}

function getAllRoads() {
  return db.roads.toArray();
}

async function deleteRoad(id) {
  return db.roads.delete(id);
}

async function findById(id) {
  return db.roads.where('id').equals(id).first();
}

async function modifyRoad({ id, name, coordinates, model_id }) {
  db.roads.where("id").equals(id).modify((value, ref) => {
    ref.value = {
      name, coordinates, model_id
    }
  });
}

const DbInstance = {
  addRoad,
  getAllRoads,
  deleteRoad,
  findById,
  modifyRoad,
};

export default DbInstance;

