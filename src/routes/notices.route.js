import express from "express";
import { verifyFaculty } from "../middlewares/auth.js";
import { addNotice, deleteNotice, getAllNotices } from "../controllers/notices.controller.js";


const Router = express.Router();

Router.post("/addnotices", verifyFaculty, addNotice);
Router.delete("/deletenotices/:id", verifyFaculty, deleteNotice);
Router.post("/deletenotices/:id", verifyFaculty, deleteNotice); // Support POST method for delete
Router.get("/manage", verifyFaculty, getAllNotices);


export default Router;