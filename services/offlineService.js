import { openDB } from 'idb';

class OfflineService {
  constructor() {
    this.dbName = 'ExamPulseDB';
    this.version = 1;
    this.db = null;
    this.initDB();
  }

  async initDB() {
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db) {
        // Create stores for different data types
        if (!db.objectStoreNames.contains('exercises')) {
          db.createObjectStore('exercises', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('scores')) {
          db.createObjectStore('scores', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('pendingSyncs')) {
          db.createObjectStore('pendingSyncs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('studyMaterials')) {
          db.createObjectStore('studyMaterials', { keyPath: 'id' });
        }
      },
    });
  }

  async saveData(storeName, data) {
    if (!this.db) await this.initDB();
    
    const tx = this.db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    if (Array.isArray(data)) {
      for (const item of data) {
        await store.put(item);
      }
    } else {
      await store.put(data);
    }
    
    await tx.done;
  }

  async loadData(storeName, key = null) {
    if (!this.db) await this.initDB();
    
    const tx = this.db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    
    if (key) {
      return await store.get(key);
    } else {
      return await store.getAll();
    }
  }

  async deleteData(storeName, key) {
    if (!this.db) await this.initDB();
    
    const tx = this.db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.delete(key);
    await tx.done;
  }

  async savePendingSync(syncData) {
    await this.saveData('pendingSyncs', syncData);
  }

  async getPendingSyncs() {
    return await this.loadData('pendingSyncs');
  }

  async clearPendingSyncs() {
    if (!this.db) await this.initDB();
    
    const tx = this.db.transaction('pendingSyncs', 'readwrite');
    const store = tx.objectStore('pendingSyncs');
    await store.clear();
    await tx.done;
  }

  async processSync(syncData) {
    try {
      // Implement sync logic based on action type
      switch (syncData.action) {
        case 'SYNC_SCORE':
          await this.syncScore(syncData.data);
          break;
        case 'SYNC_EXERCISE':
          await this.syncExercise(syncData.data);
          break;
        case 'SYNC_PROGRESS':
          await this.syncProgress(syncData.data);
          break;
        default:
          console.warn('Unknown sync action:', syncData.action);
      }
      
      // Remove from pending syncs after successful sync
      await this.deleteData('pendingSyncs', syncData.id);
    } catch (error) {
      console.error('Sync processing failed:', error);
      throw error;
    }
  }

  async syncScore(scoreData) {
    // Implementation for syncing scores to server
    const response = await fetch('/api/scores/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData)
    });

    if (!response.ok) {
      throw new Error('Score sync failed');
    }
  }

  async syncExercise(exerciseData) {
    // Implementation for syncing exercises to server
    const response = await fetch('/api/exercises/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exerciseData)
    });

    if (!response.ok) {
      throw new Error('Exercise sync failed');
    }
  }

  async syncProgress(progressData) {
    // Implementation for syncing progress to server
    const response = await fetch('/api/progress/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progressData)
    });

    if (!response.ok) {
      throw new Error('Progress sync failed');
    }
  }

  async getOfflineStatus() {
    const exercises = await this.loadData('exercises');
    const scores = await this.loadData('scores');
    const pendingSyncs = await this.loadData('pendingSyncs');
    
    return {
      exercisesCount: exercises.length,
      scoresCount: scores.length,
      pendingSyncsCount: pendingSyncs.length,
      lastSync: await this.getLastSyncTime()
    };
  }

  async getLastSyncTime() {
    // Implementation to get last successful sync time
    return localStorage.getItem('lastSyncTime');
  }

  async clearAllData() {
    if (!this.db) await this.initDB();
    
    const storeNames = ['exercises', 'scores', 'progress', 'pendingSyncs', 'studyMaterials'];
    
    for (const storeName of storeNames) {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear();
      await tx.done;
    }
  }
}

export const offlineService = new OfflineService();