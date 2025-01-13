import express from 'express'

import { insertMessaggio, getAllMessaggi, getAllMessaggiSegnalazioni, updateMessaggio2, getMessaggioSegnalazioniParams, getMessaggioNotificheParams } from '../controllers/messaggi.js';

const router = express.Router();

router.get('/:cod', getAllMessaggi)
router.get('/segnalazioni/:cod', getAllMessaggiSegnalazioni)
router.post('/segnalazioni/', getMessaggioSegnalazioniParams)
router.post('/notifiche/', getMessaggioNotificheParams)
router.post('/', insertMessaggio)
router.post('/ById', )
router.delete("/", )
router.patch("/:id", updateMessaggio2)


export default router;