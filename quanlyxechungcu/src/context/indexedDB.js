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

const dbPromise = openDB("userShiftsDB", 1, {
  upgrade(db) {
    db.createObjectStore("shifts", { keyPath: "id" });
  },
});

export const saveUserShift = async (userShift) => {
  const db = await dbPromise;
  await db.put("shifts", userShift);
};

export const getAllUserShiftsFromDB = async () => {
  const db = await dbPromise;
  return await db.getAll("shifts");
};

export const deleteUserShiftFromDB = async (id) => {
  const db = await dbPromise;
  await db.delete("shifts", id);
};
