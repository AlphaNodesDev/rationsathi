import { ref, get, onValue, set as dbSet } from 'firebase/database';
import { db } from '@/lib/firebase';

export interface RationQuota {
  rice: number;
  wheat: number;
  kerosene: number;
  sugar: number;
  ricePrice: number;
  wheatPrice: number;
  kerosenePrice: number;
  sugarPrice: number;
  lastUpdated: string;
}

export interface MonthlyHistory {
  month: string;
  rice: number;
  wheat: number;
  kerosene: number;
  sugar: number;
}

export const getCurrentRation = async (cardType: string): Promise<RationQuota | null> => {
  try {
    const snapshot = await get(ref(db, `ration/${cardType}/currentMonth`));
    return snapshot.val();
  } catch (error) {
    console.error('Error fetching ration:', error);
    return null;
  }
};

export const getRationHistory = async (cardType: string): Promise<MonthlyHistory[]> => {
  try {
    const snapshot = await get(ref(db, `ration/${cardType}/history`));
    const data = snapshot.val();
    if (!data) return [];
    return Object.values(data);
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export const listenToRation = (cardType: string, callback: (data: RationQuota | null) => void) => {
  const rationRef = ref(db, `ration/${cardType}/currentMonth`);
  return onValue(rationRef, (snapshot) => {
    callback(snapshot.val());
  });
};

// Demo data for when Firebase data isn't available
export const getDemoRation = (cardType: string): RationQuota => {
  const quotas: Record<string, RationQuota> = {
    BPL: { rice: 5, wheat: 5, kerosene: 3, sugar: 1, ricePrice: 3, wheatPrice: 2, kerosenePrice: 15, sugarPrice: 13.5, lastUpdated: new Date().toISOString() },
    APL: { rice: 3, wheat: 3, kerosene: 2, sugar: 0.5, ricePrice: 5.65, wheatPrice: 4.15, kerosenePrice: 20, sugarPrice: 13.5, lastUpdated: new Date().toISOString() },
    AAY: { rice: 7, wheat: 7, kerosene: 4, sugar: 1.5, ricePrice: 2, wheatPrice: 1, kerosenePrice: 12, sugarPrice: 13.5, lastUpdated: new Date().toISOString() },
    Priority: { rice: 5, wheat: 5, kerosene: 3, sugar: 1, ricePrice: 3, wheatPrice: 2, kerosenePrice: 15, sugarPrice: 13.5, lastUpdated: new Date().toISOString() },
  };
  return quotas[cardType] || quotas.BPL;
};

export const getDemoHistory = (): MonthlyHistory[] => [
  { month: 'Sep 2025', rice: 5, wheat: 5, kerosene: 3, sugar: 1 },
  { month: 'Oct 2025', rice: 5, wheat: 4, kerosene: 3, sugar: 1 },
  { month: 'Nov 2025', rice: 5, wheat: 5, kerosene: 2, sugar: 1 },
  { month: 'Dec 2025', rice: 6, wheat: 5, kerosene: 3, sugar: 1.5 },
  { month: 'Jan 2026', rice: 5, wheat: 5, kerosene: 3, sugar: 1 },
  { month: 'Feb 2026', rice: 5, wheat: 5, kerosene: 3, sugar: 1 },
];
