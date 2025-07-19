

import UserRoute from '../app/Users/routes'

import { Router } from "express";

const router = Router();

// router.get('/admin', UserRoute);
router.use('/user', UserRoute);
export default router;
