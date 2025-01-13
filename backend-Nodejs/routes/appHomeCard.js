import express from 'express'
import { getAllAppHomeCard,getAllSettingsApp, updateSettingsApp, updateAppHomeCard } from '../controllers/appHomeCard.js';

const router = express.Router();

router.get('/:cod', getAllAppHomeCard)
router.post('/updateAppHomeCard/:cod', updateAppHomeCard)
router.get('/settings/:cod', getAllSettingsApp)
router.post('/updateSettings/:cod', updateSettingsApp)

//router.post('/', insertEvento)

//router.patch("/:id", updateEvento)

export default router;