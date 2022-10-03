import Dexie from 'dexie';
import { indexedDB, IDBKeyRange } from "fake-indexeddb";

export const dbname = 'UsahaDB';
export const dbCon = new Dexie(dbname, { indexedDB: indexedDB, IDBKeyRange: IDBKeyRange });

dbCon.version(1).stores({
  produk: '++id, name, price, satuan, category, created_date, updated_date', // Primary key and indexed props
});