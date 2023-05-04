type StorageType = "localStorage" | "sessionStorage";


export class WebStorage {
    static type : StorageType;

    constructor(type: StorageType) {
        WebStorage.type = type;
    }

    getKey<T>(key: string): T | null {
        const result = window[WebStorage.type].getItem(key);
        
        if (result == null) {
            return null;
        } else {
            return JSON.parse(result);
        }
    }

    setKey<T>(key: string, data: T): void {
        const value : string = typeof data == "string" ? data : JSON.stringify(data);
        
        window[WebStorage.type].setItem(key, value);
    }

    remove(key: string): void {
        window[WebStorage.type].removeItem(key);
    } 

    clear(): void {
        window[WebStorage.type].clear();
    }
}