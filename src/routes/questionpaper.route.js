import express from 'express';
import { addQuestionPaper, deleteQuestionPaper } from '../controllers/questionpaper.controller.js';
import { verifyFaculty } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.middleware.js';

const Router = express.Router();

Router.post('/addquestionpaper', verifyFaculty, upload, addQuestionPaper);
Router.delete('/deletequestionpaper/:id', verifyFaculty, deleteQuestionPaper);

export default Router;