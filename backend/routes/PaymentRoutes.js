import express from 'express'
import { checkPaymentStatus, CreateOrderForAdmin, requestRefund, VerifyPaymentForAdmin } from '../controllers/PaymentControllers.js';
import protectRoute from '../middleware/protectRoute.js';
const router=express.Router();
router.post('/check-status-orders',checkPaymentStatus);
router.post('/create-order-for-Admin',CreateOrderForAdmin);
router.post('/verify-payment-for-Admin',VerifyPaymentForAdmin);
router.post('/request-refund',requestRefund);
export default router