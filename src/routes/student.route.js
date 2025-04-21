import express from "express";
import { registerStudent, studentLogin, studentLogout, getquestionpapers, getnotes, getNotices, showRegisterPage, showLoginPage, showDashboard } from "../controllers/student.controller.js";
import { verifyStudent } from "../middlewares/auth.js";
// import { showRegisterPage } from "../controllers/student.controller.js";



const router = express.Router();
router.get("/register", showRegisterPage);
router.post("/register", registerStudent);
router.get("/login", showLoginPage)
router.post("/login", studentLogin);
//Secure routes
router.get("/dashboard", verifyStudent, showDashboard);
router.post("/logout", verifyStudent, studentLogout);
router.get("/getnotes", verifyStudent, getnotes);
router.get("/getquestionpapers", verifyStudent, getquestionpapers);
router.get("/getnotices", verifyStudent, getNotices);

export default router;