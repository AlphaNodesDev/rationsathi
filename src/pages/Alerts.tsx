import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Alert, getDemoAlerts, markAlertRead } from '@/services/alertService';
import { Bell, CheckCircle, AlertTriangle, Package, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const typeIcons = {
  update: AlertTriangle,
  reminder: Clock,
  new_product: Package,
};

const typeColors = {
  update: 'bg-warning/10 text-warning',
  reminder: 'bg-info/10 text-info',
  new_product: 'bg-primary/10 text-primary',
};

const Alerts = () => {
  const { profile } = useAuthStore();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setAlerts(getDemoAlerts());
  }, [profile?.cardType]);

  const handleMarkRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    if (profile?.cardType) {
      markAlertRead(profile.cardType, id);
    }
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
          <p className="text-sm text-muted-foreground">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative">
          <Bell className="h-6 w-6 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert, i) => {
            const Icon = typeIcons[alert.type];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card flex gap-4 rounded-2xl p-5 transition-all ${!alert.read ? 'border-l-4 border-l-primary' : 'opacity-70'}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeColors[alert.type]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-foreground">{alert.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
                  {!alert.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 gap-1 text-xs text-primary"
                      onClick={() => handleMarkRead(alert.id)}
                    >
                      <CheckCircle className="h-3 w-3" /> Mark as read
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {alerts.length === 0 && (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <Bell className="mb-4 h-12 w-12" />
            <p>No alerts yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
