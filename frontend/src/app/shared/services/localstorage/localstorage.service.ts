import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
    isLocalStorageAvailable(): boolean {
        try {
          const testKey = 'test';
          localStorage.setItem(testKey, testKey);
          localStorage.removeItem(testKey);
          return true;
        } catch (e) {
          return false;
        }
    }

    setItem(key: string, value: string): void {
        if (this.isLocalStorageAvailable()) {
          localStorage.setItem(key, value);
        } else {
          console.warn('LocalStorage is not available');
        }
    }

    getItem(key: string): string | null {
      if (this.isLocalStorageAvailable()) {
        return localStorage.getItem(key);
      } else {
        console.warn('LocalStorage is not available');
        return null;
      }
    }

    removeItem(key: string): void {
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(key);
      } else {
        console.warn('LocalStorage is not available');
      }
    }
}
