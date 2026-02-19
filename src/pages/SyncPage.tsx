import { Cloud, CloudOff, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

const SyncPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    // Simulate sync
    await new Promise(r => setTimeout(r, 2000));
    setLastSync(new Date().toLocaleTimeString());
    setSyncing(false);
  };

  return (
    <div className="p-4 pb-20 max-w-lg mx-auto animate-fade-in">
      <h1 className="text-xl font-bold font-heading mb-4">Sync Status</h1>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {isOnline ? (
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Cloud className="w-6 h-6 text-success" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <CloudOff className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-semibold text-foreground">{isOnline ? 'Connected' : 'Offline'}</p>
              <p className="text-sm text-muted-foreground">
                {isOnline ? 'Data syncing in real-time' : 'Changes will sync when online'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Sync Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Sync</span>
            <span className="font-medium text-foreground">{lastSync || 'Not yet synced'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pending Changes</span>
            <span className="flex items-center gap-1 text-success font-medium">
              <Check className="w-3.5 h-3.5" /> All synced
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Connection Quality</span>
            <span className="font-medium text-foreground">{isOnline ? 'Good' : 'N/A'}</span>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSync} disabled={syncing || !isOnline} className="w-full h-11">
        <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
        {syncing ? 'Syncing...' : 'Sync Now'}
      </Button>

      {!isOnline && (
        <div className="mt-4 flex items-start gap-2 text-sm text-warning bg-warning/10 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>You are offline. Data will be cached locally and synced when connectivity is restored.</span>
        </div>
      )}
    </div>
  );
};

export default SyncPage;
