import express from 'express'
import { getData, sendLink, studentLogin, uploadData, validateLink } from '../controllers/AdminController.js'
import { authenticateUser } from '../middleware/protectRoute.js'

const router=express.Router()

router.post('/uploadData', uploadData )
router.get('/getData', getData )
router.post('/sendLink', sendLink)
router.post('/validateLink', validateLink)
router.post('/studentLogin', studentLogin)
router.get('/interview/:studentId')
// router.post('/validate/:studentId', validateLink)

export default router