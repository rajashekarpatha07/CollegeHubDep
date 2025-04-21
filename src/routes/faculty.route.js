import express from "express";
import { registerFaculty, LoginFaculty,  LogoutFaculty} from "../controllers/faculty.controller.js";
import { verifyFaculty } from "../middlewares/auth.js";

const router = express.Router();    

router.post("/register", registerFaculty);
router.post("/login", LoginFaculty);
//Secure routes 
router.post("/logout", verifyFaculty,  LogoutFaculty);

export default router;