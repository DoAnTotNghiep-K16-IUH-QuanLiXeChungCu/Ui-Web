// indexedDB.js
import { openDB } from "idb";

const dbName = "UserDatabase";
const storeName = "UserStore";

// Tạo và khởi tạo IndexedDB
const initDB = async () => {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      db.createObjectStore(storeName, { keyPath: "id" });
    },
  });
  return db;
};

// Lưu dữ liệu vào IndexedDB
export const saveData = async (data) => {
  const db = await initDB();
  await db.put(storeName, data);
};

// Lấy dữ liệu từ IndexedDB
export const getData = async (id) => {
  const db = await initDB();
  return await db.get(storeName, id);
};

// Lấy tất cả dữ liệu
export const getAllData = async () => {
  const db = await initDB();
  return await db.getAll(storeName);
};

// Xóa dữ liệu
export const deleteData = async (id) => {
  const db = await initDB();
  await db.delete(storeName, id);
};