import { getDemoRation, RationQuota } from './rationService';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Real ration data from Kerala Civil Supplies Department
const rationData = {
  rice: {
    name: 'Rice',
    qualities: ['Super Fine', 'Fine', 'Coarse'],
    pricePHH: 3, // Rs/kg for Priority Households
    priceAAY: 2, // Rs/kg for Antyodaya Anna Yojana
    details: 'Essential staple food distributed under Public Distribution System',
    benefits: 'Subsidized prices ensuring food security for eligible households'
  },
  wheat: {
    name: 'Wheat',
    qualities: ['Whole Wheat'],
    pricePHH: 2,
    priceAAY: 2,
    details: 'Whole grain distributed for making chapatis and bread',
    benefits: 'Affordable source of carbohydrates and nutrition'
  },
  sugar: {
    name: 'Sugar',
    qualities: ['Refined Sugar'],
    price: 13.50, // Rs/kg
    details: 'Refined sugar distributed monthly',
    benefits: 'Essential sweetener for daily consumption'
  },
  kerosene: {
    name: 'Kerosene',
    qualities: ['Standard'],
    price: 15.25, // Rs/litre
    details: 'Fuel for lighting and cooking in rural areas',
    benefits: 'Subsidized fuel for low-income families'
  },
  palmOil: {
    name: 'Palm Oil',
    qualities: ['Refined'],
    price: 25.75, // Rs/litre
    details: 'Edible oil distributed under PDS',
    benefits: 'Healthy cooking oil at affordable prices'
  }
};

// Quantities based on card type
const quantities = {
  BPL: { rice: 5, wheat: 5, kerosene: 3, sugar: 1 },
  APL: { rice: 3, wheat: 3, kerosene: 2, sugar: 0.5 },
  AAY: { rice: 7, wheat: 7, kerosene: 4, sugar: 1.5 },
  Priority: { rice: 5, wheat: 5, kerosene: 3, sugar: 1 },
};

// Simple rule-based NLP for ration queries
export const processQuery = (query: string, cardType: string): { answer: string; quota: RationQuota } => {
  const q = query.toLowerCase();
  const isAAY = cardType === 'AAY';
  const qty = quantities[cardType as keyof typeof quantities];

  // Get prices from data
  const ricePrice = isAAY ? rationData.rice.priceAAY : rationData.rice.pricePHH;
  const wheatPrice = isAAY ? rationData.wheat.priceAAY : rationData.wheat.pricePHH;
  const kerosenePrice = rationData.kerosene.price;
  const sugarPrice = rationData.sugar.price;

  const quota: RationQuota = {
    rice: qty.rice,
    wheat: qty.wheat,
    kerosene: qty.kerosene,
    sugar: qty.sugar,
    ricePrice,
    wheatPrice,
    kerosenePrice,
    sugarPrice,
    lastUpdated: new Date().toISOString()
  };

  // Check for specific item queries
  if (q.includes('rice') || q.includes('ari') || q.includes('chawal')) {
    const total = qty.rice * ricePrice;
    if (q.includes('quality') || q.includes('type') || q.includes('details')) {
      return {
        answer: `Rice details:\n• Qualities: ${rationData.rice.qualities.join(', ')}\n• Price: ₹${ricePrice}/kg\n• Your quota: ${qty.rice}kg\n• Total cost: ₹${total.toFixed(2)}\n• Details: ${rationData.rice.details}\n• Benefits: ${rationData.rice.benefits}`,
        quota,
      };
    }
    return {
      answer: `You have ${qty.rice}kg of rice this month at ₹${ricePrice}/kg. Total: ₹${total.toFixed(2)}. Qualities: ${rationData.rice.qualities.join(', ')}. ${rationData.rice.details}`,
      quota,
    };
  }
  if (q.includes('wheat') || q.includes('gothambu') || q.includes('gehu') || q.includes('atta')) {
    const total = qty.wheat * wheatPrice;
    if (q.includes('quality') || q.includes('type') || q.includes('details')) {
      return {
        answer: `Wheat details:\n• Qualities: ${rationData.wheat.qualities.join(', ')}\n• Price: ₹${wheatPrice}/kg\n• Your quota: ${qty.wheat}kg\n• Total cost: ₹${total.toFixed(2)}\n• Details: ${rationData.wheat.details}\n• Benefits: ${rationData.wheat.benefits}`,
        quota,
      };
    }
    return {
      answer: `You have ${qty.wheat}kg of wheat this month at ₹${wheatPrice}/kg. Total: ₹${total.toFixed(2)}. Qualities: ${rationData.wheat.qualities.join(', ')}. ${rationData.wheat.details}`,
      quota,
    };
  }
  if (q.includes('kerosene') || q.includes('manne') || q.includes('mitti')) {
    const total = qty.kerosene * kerosenePrice;
    if (q.includes('quality') || q.includes('type') || q.includes('details')) {
      return {
        answer: `Kerosene details:\n• Qualities: ${rationData.kerosene.qualities.join(', ')}\n• Price: ₹${kerosenePrice}/L\n• Your quota: ${qty.kerosene}L\n• Total cost: ₹${total.toFixed(2)}\n• Details: ${rationData.kerosene.details}\n• Benefits: ${rationData.kerosene.benefits}`,
        quota,
      };
    }
    return {
      answer: `You have ${qty.kerosene}L of kerosene this month at ₹${kerosenePrice}/L. Total: ₹${total.toFixed(2)}. Qualities: ${rationData.kerosene.qualities.join(', ')}. ${rationData.kerosene.details}`,
      quota,
    };
  }
  if (q.includes('sugar') || q.includes('panju saara') || q.includes('cheeni') || q.includes('shakkar')) {
    const total = qty.sugar * sugarPrice;
    if (q.includes('quality') || q.includes('type') || q.includes('details')) {
      return {
        answer: `Sugar details:\n• Qualities: ${rationData.sugar.qualities.join(', ')}\n• Price: ₹${sugarPrice}/kg\n• Your quota: ${qty.sugar}kg\n• Total cost: ₹${total.toFixed(2)}\n• Details: ${rationData.sugar.details}\n• Benefits: ${rationData.sugar.benefits}`,
        quota,
      };
    }
    return {
      answer: `You have ${qty.sugar}kg of sugar this month at ₹${sugarPrice}/kg. Total: ₹${total.toFixed(2)}. Qualities: ${rationData.sugar.qualities.join(', ')}. ${rationData.sugar.details}`,
      quota,
    };
  }
  if (q.includes('price') || q.includes('cost') || q.includes('vila') || q.includes('kitna') || q.includes('total')) {
    const total = quota.rice * ricePrice + quota.wheat * wheatPrice + quota.kerosene * kerosenePrice + quota.sugar * sugarPrice;
    return {
      answer: `Your total ration cost this month is ₹${total.toFixed(2)}.\nBreakdown:\n• Rice: ${qty.rice}kg × ₹${ricePrice} = ₹${(qty.rice * ricePrice).toFixed(2)}\n• Wheat: ${qty.wheat}kg × ₹${wheatPrice} = ₹${(qty.wheat * wheatPrice).toFixed(2)}\n• Kerosene: ${qty.kerosene}L × ₹${kerosenePrice} = ₹${(qty.kerosene * kerosenePrice).toFixed(2)}\n• Sugar: ${qty.sugar}kg × ₹${sugarPrice} = ₹${(qty.sugar * sugarPrice).toFixed(2)}`,
      quota,
    };
  }

  // Default: show all
  const total = quota.rice * ricePrice + quota.wheat * wheatPrice + quota.kerosene * kerosenePrice + quota.sugar * sugarPrice;
  return {
    answer: `Your ${cardType} card quota this month:\n• Rice: ${qty.rice}kg at ₹${ricePrice}/kg (Total: ₹${(qty.rice * ricePrice).toFixed(2)}) - Qualities: ${rationData.rice.qualities.join(', ')}\n• Wheat: ${qty.wheat}kg at ₹${wheatPrice}/kg (Total: ₹${(qty.wheat * wheatPrice).toFixed(2)}) - Qualities: ${rationData.wheat.qualities.join(', ')}\n• Kerosene: ${qty.kerosene}L at ₹${kerosenePrice}/L (Total: ₹${(qty.kerosene * kerosenePrice).toFixed(2)}) - Qualities: ${rationData.kerosene.qualities.join(', ')}\n• Sugar: ${qty.sugar}kg at ₹${sugarPrice}/kg (Total: ₹${(qty.sugar * sugarPrice).toFixed(2)}) - Qualities: ${rationData.sugar.qualities.join(', ')}\n\nGrand Total: ₹${total.toFixed(2)}`,
    quota,
  };
};
