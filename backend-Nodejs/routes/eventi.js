import express from 'express'
import { deleteEvento, getAllEventi, getEventoById, insertEvento, updateEvento } from '../controllers/eventi.js';

const router = express.Router();

router.get('/:cod', getAllEventi)

router.post('/', insertEvento)

router.post('/ById', getEventoById)

router.delete("/", deleteEvento)

router.patch("/:id", updateEvento)

export default router;