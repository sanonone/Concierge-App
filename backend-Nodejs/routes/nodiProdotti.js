import express from 'express'

//import { getAllProdotti, insertProdotto, deleteProdotto, getProdottoById, updateProdotto } from '../controllers/prodotti.js';
import { getAllNodiProdotti, insertNodoProdotto, getNodoProdottoById, updateNodoProdotto, deleteNodoProdotto } from '../controllers/nodiProdotti.js';

const router = express.Router();

router.get('/:cod', getAllNodiProdotti)

router.post('/', insertNodoProdotto)

router.post('/ById', getNodoProdottoById)

router.delete("/", deleteNodoProdotto)

router.patch("/:id", updateNodoProdotto)

export default router;