import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getDemoHistory, RationQuota, MonthlyHistory } from '@/services/rationService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Wheat, Droplets, CircleDot, Package, TrendingUp, Calendar, Download, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

const iconMap = {
  rice: Wheat,
  wheat: Package,
  kerosene: Droplets,
  sugar: CircleDot,
};

const quantities = {
  BPL: { rice: 5, wheat: 5, kerosene: 3, sugar: 1 },
  APL: { rice: 3, wheat: 3, kerosene: 2, sugar: 0.5 },
  AAY: { rice: 7, wheat: 7, kerosene: 4, sugar: 1.5 },
  Priority: { rice: 5, wheat: 5, kerosene: 3, sugar: 1 },
};

const Dashboard = () => {
  const { profile } = useAuthStore();
  const [quota, setQuota] = useState<RationQuota | null>(null);
  const [history, setHistory] = useState<MonthlyHistory[]>([]);
  const [rationData, setRationData] = useState<any>(null);

  const cardType = profile?.cardType || 'BPL';

  useEffect(() => {
    // Fetch real ration data from backend
    fetch('http://localhost:3000/api/ration-data')
      .then(res => res.json())
      .then(data => {
        setRationData(data);
        const isAAY = cardType === 'AAY';
        const ricePrice = isAAY ? data.rice.priceAAY : data.rice.pricePHH;
        const wheatPrice = isAAY ? data.wheat.priceAAY : data.wheat.pricePHH;
        const kerosenePrice = data.kerosene.price;
        const sugarPrice = data.sugar.price;
        const qty = quantities[cardType as keyof typeof quantities];
        setQuota({
          rice: qty.rice,
          wheat: qty.wheat,
          kerosene: qty.kerosene,
          sugar: qty.sugar,
          ricePrice,
          wheatPrice,
          kerosenePrice,
          sugarPrice,
          lastUpdated: new Date().toISOString()
        });
      })
      .catch(error => {
        console.error('Error fetching ration data:', error);
        // Fallback to demo data
        setQuota(getDemoRation(cardType));
      });

    setHistory(getDemoHistory());
  }, [cardType]);

  const getDemoRation = (cardType: string): RationQuota => {
    const quotas: Record<string, RationQuota> = {
      BPL: { rice: 5, wheat: 5, kerosene: 3, sugar: 1, ricePrice: 3, wheatPrice: 2, kerosenePrice: 15, sugarPrice: 13.5, lastUpdated: new Date().toISOString() },
      APL: { rice: 3, wheat: 3, kerosene: 2, sugar: 0.5, ricePrice: 5.65, wheatPrice: 4.15, kerosenePrice: 20, sugarPrice: 13.5, lastUpdated: new Date().toISOString() },
      AAY: { rice: 7, wheat: 7, kerosene: 4, sugar: 1.5, ricePrice: 2, wheatPrice: 1, kerosenePrice: 12, sugarPrice: 13.5, lastUpdated: new Date().toISOString() },
      Priority: { rice: 5, wheat: 5, kerosene: 3, sugar: 1, ricePrice: 3, wheatPrice: 2, kerosenePrice: 15, sugarPrice: 13.5, lastUpdated: new Date().toISOString() },
    };
    return quotas[cardType] || quotas.BPL;
  };

  const total = quota
    ? quota.rice * quota.ricePrice + quota.wheat * quota.wheatPrice + quota.kerosene * quota.kerosenePrice + quota.sugar * quota.sugarPrice
    : 0;

  const downloadPDF = () => {
    if (!quota) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('RationSathi - Monthly Statement', 20, 20);
    doc.setFontSize(12);
    doc.text(`Card Type: ${cardType}`, 20, 35);
    doc.text(`Card Number: ${profile?.rationCardNumber || 'N/A'}`, 20, 45);
    doc.text(`Name: ${profile?.fullName || 'N/A'}`, 20, 55);
    doc.text('---', 20, 65);
    doc.text(`Rice: ${quota.rice}kg @ ₹${quota.ricePrice}/kg = ₹${(quota.rice * quota.ricePrice).toFixed(2)}`, 20, 75);
    doc.text(`Wheat: ${quota.wheat}kg @ ₹${quota.wheatPrice}/kg = ₹${(quota.wheat * quota.wheatPrice).toFixed(2)}`, 20, 85);
    doc.text(`Kerosene: ${quota.kerosene}L @ ₹${quota.kerosenePrice}/L = ₹${(quota.kerosene * quota.kerosenePrice).toFixed(2)}`, 20, 95);
    doc.text(`Sugar: ${quota.sugar}kg @ ₹${quota.sugarPrice}/kg = ₹${(quota.sugar * quota.sugarPrice).toFixed(2)}`, 20, 105);
    doc.text('---', 20, 115);
    doc.text(`Total: ₹${total.toFixed(2)}`, 20, 125);
    doc.save('ration-statement.pdf');
  };

  const items = quota && rationData
    ? [
        { 
          key: 'rice', 
          label: rationData.rice.name, 
          qty: `${quota.rice} kg`, 
          price: `₹${quota.ricePrice}/kg`, 
          color: 'bg-primary/10 text-primary',
          details: rationData.rice.details,
          benefits: rationData.rice.benefits,
          qualities: rationData.rice.qualities
        },
        { 
          key: 'wheat', 
          label: rationData.wheat.name, 
          qty: `${quota.wheat} kg`, 
          price: `₹${quota.wheatPrice}/kg`, 
          color: 'bg-accent/10 text-accent-foreground',
          details: rationData.wheat.details,
          benefits: rationData.wheat.benefits,
          qualities: rationData.wheat.qualities
        },
        { 
          key: 'kerosene', 
          label: rationData.kerosene.name, 
          qty: `${quota.kerosene} L`, 
          price: `₹${quota.kerosenePrice}/L`, 
          color: 'bg-info/10 text-info',
          details: rationData.kerosene.details,
          benefits: rationData.kerosene.benefits,
          qualities: rationData.kerosene.qualities
        },
        { 
          key: 'sugar', 
          label: rationData.sugar.name, 
          qty: `${quota.sugar} kg`, 
          price: `₹${quota.sugarPrice}/kg`, 
          color: 'bg-warning/10 text-warning',
          details: rationData.sugar.details,
          benefits: rationData.sugar.benefits,
          qualities: rationData.sugar.qualities
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            <Calendar className="mr-1 inline h-4 w-4" />
            {cardType} Card • Last updated: {quota?.lastUpdated ? new Date(quota.lastUpdated).toLocaleDateString() : 'Today'}
          </p>
        </div>
        <Button onClick={downloadPDF} variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Download Statement
        </Button>
      </div>

      {/* Quota cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = iconMap[item.key as keyof typeof iconMap];
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{item.qty}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.price}</p>
                  {item.qualities && <p className="mt-1 text-xs text-muted-foreground">Qualities: {item.qualities.join(', ')}</p>}
                  {item.details && <p className="mt-1 text-xs text-muted-foreground">{item.details}</p>}
                  {item.benefits && <p className="mt-1 text-xs text-muted-foreground">{item.benefits}</p>}
                </div>
                <div className={`rounded-xl p-3 ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total cost card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card flex items-center gap-4 rounded-2xl p-6"
      >
        <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-xl">
          <IndianRupee className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total Monthly Cost</p>
          <p className="text-3xl font-bold text-foreground">₹{total.toFixed(2)}</p>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <TrendingUp className="h-5 w-5 text-primary" /> Monthly History
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(140 15% 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(0 0% 100%)',
                  border: '1px solid hsl(140 15% 88%)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Legend />
              <Bar dataKey="rice" fill="hsl(145 63% 32%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="wheat" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="kerosene" fill="hsl(200 80% 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sugar" fill="hsl(340 65% 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
