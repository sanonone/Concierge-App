import express from 'express'
import { getAllRistoranti, insertRistorante, getRistoranteById, deleteRistorante, updateRistorante } from '../controllers/ristoranti.js';

const router = express.Router();

router.get('/:cod', getAllRistoranti)
router.post('/',  insertRistorante)
router.post('/ById', getRistoranteById)
router.delete("/", deleteRistorante)
router.patch("/:id", updateRistorante)

export default router;