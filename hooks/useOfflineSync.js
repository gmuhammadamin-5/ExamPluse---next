import { useState, useEffect, useCallback } from 'react';
import { offlineService } from '../services/offlineService';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncs, setPendingSyncs] = useState([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending syncs from storage
    offlineService.getPendingSyncs().then(setPendingSyncs);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && pendingSyncs.length > 0) {
      processPendingSyncs();
    }
  }, [isOnline, pendingSyncs.length]);

  const processPendingSyncs = useCallback(async () => {
    setSyncing(true);
    try {
      for (const sync of pendingSyncs) {
        await offlineService.processSync(sync);
      }
      setPendingSyncs([]);
      await offlineService.clearPendingSyncs();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  }, [pendingSyncs]);

  const saveOffline = useCallback(async (key, data, syncAction) => {
    try {
      await offlineService.saveData(key, data);
      
      if (!isOnline && syncAction) {
        const pendingSync = {
          id: Date.now().toString(),
          action: syncAction,
          data: data,
          timestamp: new Date().toISOString()
        };
        setPendingSyncs(prev => [...prev, pendingSync]);
        await offlineService.savePendingSync(pendingSync);
      }
      
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  }, [isOnline]);

  const loadOffline = useCallback(async (key) => {
    return await offlineService.loadData(key);
  }, []);

  const queueSync = useCallback((action, data) => {
    const pendingSync = {
      id: Date.now().toString(),
      action,
      data,
      timestamp: new Date().toISOString()
    };
    
    setPendingSyncs(prev => [...prev, pendingSync]);
    offlineService.savePendingSync(pendingSync);
  }, []);

  return {
    isOnline,
    syncing,
    pendingSyncs: pendingSyncs.length,
    saveOffline,
    loadOffline,
    queueSync
  };
};