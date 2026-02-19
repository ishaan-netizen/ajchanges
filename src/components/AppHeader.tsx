import { useAuth } from '@/contexts/AuthContext';
import { useCamp } from '@/contexts/CampContext';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff, LogOut, RefreshCw, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

const AppHeader = () => {
  const { profile, signOut } = useAuth();
  const { activeCamp, setActiveCamp } = useCamp();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const roleLabel = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : '';

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-sm font-heading shrink-0">AJ</span>
          {activeCamp && (
            <div className="flex items-center gap-1 text-xs opacity-90 truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{activeCamp.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sync Status */}
          <div className="flex items-center gap-1">
            {isOnline ? (
              <Cloud className="w-4 h-4 text-primary-foreground/80" />
            ) : (
              <CloudOff className="w-4 h-4 text-primary-foreground/60" />
            )}
            <span className="text-xs opacity-80 hidden sm:inline">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Change Camp */}
          {activeCamp && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveCamp(null)}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-7 px-2 text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Camp
            </Button>
          )}

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-7 px-2"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Role badge */}
      {profile && (
        <div className="bg-primary-foreground/10 px-3 py-1 text-xs flex items-center justify-between">
          <span>{profile.full_name || profile.email}</span>
          <span className="font-medium">{roleLabel}</span>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
