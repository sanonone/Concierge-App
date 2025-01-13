import dotenv from 'dotenv';

// Carica le variabili d'ambiente dal file .env
dotenv.config();

export const config = {
  SUITE_PW: process.env.SUITE_PW,
  PORT: process.env.ON,
  CREDENTIAL: process.env.CREDENTIAL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  REACT_APP_STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  RANDOM_STATE: process.env.RANDOM_STATE,
  STRIPE_CLIENT_ID: process.env.STRIPE_CLIENT_ID
  // Altre variabili d'ambiente
};