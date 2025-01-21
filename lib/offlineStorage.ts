import { openDB, type DBSchema, type IDBPDatabase } from "idb"

interface OfflineContent {
  id: string
  type: "movie" | "episode" | "music"
  title: string
  url: string
  expiresAt: number
}

interface MyDB extends DBSchema {
  offlineContent: {
    key: string
    value: OfflineContent
    indexes: { "by-expires": number }
  }
}

const DB_NAME = "OfflineContentDB"
const STORE_NAME = "offlineContent"

async function getDB(): Promise<IDBPDatabase<MyDB>> {
  return openDB<MyDB>(DB_NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: "id" })
      store.createIndex("by-expires", "expiresAt")
    },
  })
}

export async function saveForOffline(content: OfflineContent): Promise<void> {
  const db = await getDB()
  await db.put(STORE_NAME, content)
}

export async function getOfflineContent(id: string): Promise<OfflineContent | undefined> {
  const db = await getDB()
  return db.get(STORE_NAME, id)
}

export async function removeOfflineContent(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORE_NAME, id)
}

export async function listOfflineContent(): Promise<OfflineContent[]> {
  const db = await getDB()
  return db.getAll(STORE_NAME)
}

export async function cleanExpiredContent(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(STORE_NAME, "readwrite")
  const store = tx.objectStore(STORE_NAME)
  const index = store.index("by-expires")
  let cursor = await index.openCursor()

  while (cursor) {
    if (cursor.value.expiresAt < Date.now()) {
      await cursor.delete()
    }
    cursor = await cursor.continue()
  }

  await tx.done
}

