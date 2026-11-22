const DB_NAME = "clicksy-db";
const STORE_NAME = "studio";
const DB_VERSION = 1;

export function openStudioDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            if(!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function saveStudioData<T>(
    key: string,
    value: T
): Promise<void> {
    const db = await openStudioDB();

    try {
        await new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readwrite");
            transaction.objectStore(STORE_NAME).put(value, key);

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error);
        });
    } finally {
        db.close();
    }
}

export async function loadStudioData<T>(
    key: string
): Promise<T | undefined> {
    const db = await openStudioDB();

    try {
        return await new Promise<T | undefined>(
            (resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, "readonly");

                const request = transaction.objectStore(STORE_NAME).get(key);
                request.onsuccess = () => resolve(request.result as T | undefined);

                request.onerror = () => reject(request.error);
                transaction.onabort = () => reject(transaction.error);
            }
        );
    } finally {
        db.close();
    }
} 

export type GalleryCreation<T> = {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    data: T;
};

const GALLERY_KEY = "creations-gallery";

export async function saveGalleryCreation<T>(creation: GalleryCreation<T>): Promise<void> {
    const gallery = (await loadStudioData<GalleryCreation<T>[]>(GALLERY_KEY)) ?? [];
    const existingIndex = gallery.findIndex((item) => item.id === creation.id);

    if(existingIndex >= 0) {
        gallery[existingIndex] = creation;
    } else {
        gallery.push(creation);
    }

    await saveStudioData(GALLERY_KEY, gallery);
}

export async function loadGalleryCreations<T>(): Promise<GalleryCreation<T>[]> {
    const gallery = await loadStudioData<GalleryCreation<T>[]>(GALLERY_KEY);
    return gallery ?? [];
}

export async function deleteGalleryCreation(id: string): Promise<void> {
    const gallery = await loadGalleryCreations<unknown>();
    const updatedGallery = gallery.filter((creation) => creation.id !== id);
    await saveStudioData(GALLERY_KEY, updatedGallery);
}