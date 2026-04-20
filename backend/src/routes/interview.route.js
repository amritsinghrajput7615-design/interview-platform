const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');
const authmiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/file.middleware');


router.post('/',authmiddleware,upload.single('resume'),interviewController.generateInterViewReportController)

router.get('/report/:interviewId',authmiddleware,interviewController.getInterviewReportByIdController)

router.get('/',authmiddleware,interviewController.getAllInterviewReportsController)

router.post("/resume/pdf/:interviewReportId", authmiddleware, interviewController.generateResumePdfController)
module.exports = router;