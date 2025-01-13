import express from 'express'

import { insertServizio, insertPrenotazioneServizio,getAllServizi, deleteServizio, deletePrenotazioneServizio, getServizioById, updateServizio, getAllPrenotazioniServizi, getPrenotazioniServiziByUser,getDisponibilitaServizi, updatePrenotazioneServizio,  disponibilitaPerPrenotazione, insertPrenotazioneRoomS, updatePrenotazioneRoomS, getPrenotazioniRoomSByUser, getPrenotazioniRoomS} from '../controllers/servizi.js';

const router = express.Router();

router.get('/:cod', getAllServizi)
router.post('/', insertServizio)
router.post('/ById', getServizioById)
router.delete("/", deleteServizio)
router.patch("/:id", updateServizio)
router.post('/insertPrenotazioneServizio', insertPrenotazioneServizio)
router.delete("/deletePrenotazioneServizio", deletePrenotazioneServizio)
router.patch("/updatePrenotazioneServizio/:id", updatePrenotazioneServizio)
router.get('/getAllPrenotazioniServizi/:cod', getAllPrenotazioniServizi)
router.post('/getPrenotazioniServiziByUser', getPrenotazioniServiziByUser)
router.get('/getDisponibilitaServizi/:cod', getDisponibilitaServizi)
router.post('/disponibilitaPerPrenotazione', disponibilitaPerPrenotazione)
router.post('/insertPrenotazioneRoomS', insertPrenotazioneRoomS)
router.patch("/updatePrenotazioneRoomS/:id", updatePrenotazioneRoomS)
router.post('/getPrenotazioniRoomSByUser', getPrenotazioniRoomSByUser)
router.get('/getPrenotazioniRoomS/:cod', getPrenotazioniRoomS)

export default router;