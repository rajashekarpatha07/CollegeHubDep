// routes/viewRoutes.js
import express from "express";
import { render } from "../middlewares/render.js";
import { verifyStudent, verifyFaculty } from "../middlewares/auth.js";

const router = express.Router();
// Public routes
router.get("/", render("landing"));
router.get("/about", render("about"));
router.get("/contact", render("contact"));
router.get("/StudentLogin", render("StudentLogin"));
router.get("/StudentRegister", render("StudentRegister"));
router.get("/FacultyLogin", render("FacultyLogin"));

// Student routes
router.get("/dashboard", render("dashboard", [verifyStudent]));
router.get("/notes", render("notes", [verifyStudent]));
router.get("/notices", render("notices", [verifyStudent]));
router.get("/questionpapers", render("questionpapers", [verifyStudent]));

// Faculty routes
router.get("/faculty-dashboard", render("faculty-dashboard", [verifyFaculty]));
router.get("/upload-notes", render("upload-notes", [verifyFaculty]));
router.get("/upload-question-papers", render("upload-question-papers", [verifyFaculty]));
router.get("/upload-notices", render("upload-notices", [verifyFaculty]));

router.get("/manage-notes", verifyFaculty, (req, res) => res.redirect("/api/v1/notes/manage"));
router.get("/manage-question-papers", verifyFaculty, (req, res) => res.redirect("/api/v1/questionpaper/manage"));
router.get("/manage-notices", verifyFaculty, (req, res) => res.redirect("/api/v1/notices/manage"));

export default router;
