// IndexedDB helper for storing and retrieving large binary APK files reliably (persists across reloads without localStorage 5MB quota limit)

const DB_NAME = 'AppVault_DB';
const DB_VERSION = 1;
const STORE_NAME = 'official_apk_store';
const KEY_NAME = 'official_apk_file';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredApkData {
  blob: Blob;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
}

export async function saveApkBlob(file: File): Promise<StoredApkData> {
  const db = await openDB();
  const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
  const data: StoredApkData = {
    blob: file,
    fileName: file.name,
    fileSize: sizeMb,
    uploadedAt: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(data, KEY_NAME);

    req.onsuccess = () => resolve(data);
    req.onerror = () => reject(req.error);
  });
}

export async function getStoredApkBlob(): Promise<StoredApkData | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY_NAME);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to get APK from IndexedDB', err);
    return null;
  }
}

export async function deleteStoredApkBlob(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(KEY_NAME);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to delete APK from IndexedDB', err);
  }
}

// Convert Google Drive share link into direct download link if detected
export function formatDownloadLink(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // Google drive file pattern
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = trimmed.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  
  return trimmed;
}
