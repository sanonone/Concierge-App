import express from 'express'
//import { deleteEvento, getAllEventi, getEventoById, insertEvento, updateEvento } from '../controllers/eventi.js';
import { getAllProdotti, insertProdotto, deleteProdotto, getProdottoById, updateProdotto } from '../controllers/prodotti.js';

const router = express.Router();

router.get('/:cod', getAllProdotti)

router.post('/', insertProdotto)

router.post('/ById', getProdottoById)

router.delete("/", deleteProdotto)

router.patch("/:id", updateProdotto)

export default router;