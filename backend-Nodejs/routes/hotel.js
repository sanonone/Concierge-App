import express from 'express'
import { deleteHotel, getAllHotel, getHotelById, insertHotel, updateHotel } from '../controllers/hotel.js';


const router = express.Router();

router.get('/:cod', getAllHotel)
router.post('/',  insertHotel)
router.post('/ById', getHotelById)
router.delete("/", deleteHotel)
router.patch("/:id", updateHotel)

export default router;