import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/ration-data', (req, res) => {
  const data = {
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
  res.json(data);
});

app.listen(3000, () => console.log('Backend server running on port 3000'));
