import { ref, onValue, update } from 'firebase/database';
import { db } from '@/lib/firebase';

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'reminder' | 'new_product';
  timestamp: string;
  read: boolean;
}

export const listenToAlerts = (cardType: string, callback: (alerts: Alert[]) => void) => {
  const alertsRef = ref(db, `alerts/${cardType}`);
  return onValue(alertsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    const alerts: Alert[] = Object.entries(data).map(([id, val]: [string, any]) => ({
      id,
      ...val,
    }));
    callback(alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  });
};

export const markAlertRead = async (cardType: string, alertId: string) => {
  try {
    await update(ref(db, `alerts/${cardType}/${alertId}`), { read: true });
  } catch (error) {
    console.error('Error marking alert:', error);
  }
};

export const getDemoAlerts = (): Alert[] => [
  {
    id: '1',
    title: 'Rice Quota Updated',
    message: 'Government has updated rice quota for this month. Check your dashboard.',
    type: 'update',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: '2',
    title: 'Month-End Reminder',
    message: 'Collect your ration before the month ends. Visit your nearest FPS.',
    type: 'reminder',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: false,
  },
  {
    id: '3',
    title: 'New Product Available',
    message: 'Cooking oil is now available at subsidized rates through your ration card.',
    type: 'new_product',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    read: true,
  },
];
