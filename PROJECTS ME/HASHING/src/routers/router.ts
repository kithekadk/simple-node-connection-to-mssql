import { Router } from "express";
import { getHomepage, loginUser, registerUser } from "../controller/userController";
import { verifyTokens } from "../middleware/verifyTokens";

const router = Router();

router.post('/signup', registerUser)
router.post('/login',loginUser)
router.get('/homepage',verifyTokens , getHomepage)

export default router;