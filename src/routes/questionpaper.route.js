import express from 'express';
import { addQuestionPaper, deleteQuestionPaper, getAllQuestionPapers } from '../controllers/questionpaper.controller.js';
import { verifyFaculty } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.middleware.js';

const Router = express.Router();

Router.post('/addquestionpaper', verifyFaculty, upload, addQuestionPaper);
Router.delete('/deletequestionpaper/:id', verifyFaculty, deleteQuestionPaper);
Router.post('/deletequestionpaper/:id', verifyFaculty, deleteQuestionPaper);
Router.get('/manage', verifyFaculty, getAllQuestionPapers);

export default Router;