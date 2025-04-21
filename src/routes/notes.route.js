import express from "express";
import { addNote, deleteNotes} from "../controllers/notes.controller.js";
import { verifyFaculty } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.middleware.js";


const Router = express.Router();

Router.post("/addnotes", verifyFaculty,upload, addNote);
Router.delete("/deletenotes/:id", verifyFaculty, deleteNotes);


export default Router;
