import express from 'express'
import { createConnectedAccount, accountLink, createCheckoutSession, createCheckoutSessionMobile } from '../controllers/stripe.js';

const router = express.Router();


router.post('/create-connected-account', createConnectedAccount)
router.post('/account_link', accountLink)
router.post('/create-checkout-session', createCheckoutSession)
router.post('/create-checkout-session-mobile', createCheckoutSessionMobile)



export default router;