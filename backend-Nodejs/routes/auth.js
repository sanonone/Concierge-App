import express from 'express'
import { register, login, appLogin, getIp , getAllUsers, updateUser, deleteUser, updateUserTokenNotify, getDatePrenotazione, appLoginGuest, webLoginGuest, getUserByID, updateUserIdStripe, appRegisterStandard, appLoginStandard} from '../controllers/auth.js'
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();



router.post('/register', register)
router.post('/login', login)
router.post('/appLogin', appLogin)
router.post('/appLoginGuest', appLoginGuest)
router.post('/appRegisterStandard', appRegisterStandard)
router.post('/appLoginStandard', appLoginStandard)
router.post('/webLoginGuest', webLoginGuest)
router.post('/getDatePrenotazione', getDatePrenotazione)
router.get('/getIp/:cod', getIp)
router.get('/getAllUsers', authenticateToken,getAllUsers)
router.get('/getUserByID/:id', getUserByID)
router.patch('/updateUser/:id', authenticateToken,updateUser)
router.patch('/updateUserIdStripe/:id', authenticateToken,updateUserIdStripe)
router.patch('/updateUserTokenNotify/:id', authenticateToken,updateUserTokenNotify)
router.delete('/deleteUser/:codStruttura', authenticateToken,deleteUser)


export default router;