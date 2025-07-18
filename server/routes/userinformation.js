import express from 'express';
import { protect } from '../middlewear/authmiddlewear.js';
import {  getUserInfo, upsertUserInfo } from '../controllers/Userinformation.js';


const router = express.Router();

router
  .route('/')
  .get(protect, getUserInfo)     // GET /api/userinfo
  .post(protect, upsertUserInfo) // POST /api/userinfo

export default router;
