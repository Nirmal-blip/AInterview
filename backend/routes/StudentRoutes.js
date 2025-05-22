import express from "express";
import { checkLinkStatus, getStudents, sendLink, updateStatus, uploadStudents } from "../controllers/StudentController.js";
import protectRoute from "../middleware/protectRoute.js";
const router=express.Router();
router.post('/upload',protectRoute, uploadStudents);
router.get('/',protectRoute,getStudents);
router.post('/send-link',protectRoute,sendLink);
router.post('/check-link-status/:db_name/:id',checkLinkStatus);
router.put('/update-link-status/:db_name',updateStatus)
export default router;