import express from 'express'
import { getAllProdotti, getProdottiServizi, getProdottiCar, getTariffa, addebitaServizio, addebitaRoomS } from '../controllers/suite.js';


const router = express.Router();

router.get('/prodotti', getAllProdotti)

router.post('/prodottiServizi', getProdottiServizi)

router.post('/getTariffa', getTariffa)

router.post('/prodottiCar', getProdottiCar )

router.post('/addebitaServizio', addebitaServizio)

router.post('/addebitaRoomS', addebitaRoomS)

router.delete("/:id", )

router.patch("/:id", )

export default router;