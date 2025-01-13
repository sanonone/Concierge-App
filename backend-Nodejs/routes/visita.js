import express from 'express'
import { getAllVisita, insertVisita, deleteVisita, updateVisita } from '../controllers/visita.js';

const router = express.Router();

router.get('/:cod', getAllVisita)
router.post('/',  insertVisita)
//router.post('/ById', )
router.delete("/", deleteVisita)
router.patch("/:id", updateVisita)

export default router;