import express from "express";
import { verifyFaculty } from "../middlewares/auth.js";
import { addNotice } from "../controllers/notices.controller.js";


const Router = express.Router();

Router.post("/addnotices", verifyFaculty, addNotice);
// Router.delete("/deletenotes/:id", verifyFaculty, deleteNotes);


export default Router;