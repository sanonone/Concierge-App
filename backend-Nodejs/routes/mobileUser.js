import express from 'express'

import { insertMobileUser, getAllMobileUsers, updateMobileUser , getMobileUserByParams, deleteMobileUser} from '../controllers/mobileUser.js';

const router = express.Router();

router.get('/:cod', getAllMobileUsers)
router.post('/', insertMobileUser)
router.post('/mobileUserByParams', getMobileUserByParams)
router.delete("/", deleteMobileUser)
router.patch("/update", updateMobileUser)


export default router;