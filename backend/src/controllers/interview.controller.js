
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/InterviewReport.model")
const pdfParse = require("pdf-parse-fork")
/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    
    try {
        const { selfDescription, jobDescription } = req.body

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({ message: 'Job description is required.' })
        }

       

// Usage stays the same:
const resumeText = req.file
    ? (await pdfParse(req.file.buffer)).text
    : ''
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || '',
            jobDescription
        })

        // ✅ FORMAT DATA TO MATCH SCHEMA
 const formattedData = {
    user: req.user.id,
    resume: resumeText || selfDescription || jobDescription || '',
    selfDescription,
    jobDescription,

    title: interViewReportByAi.title || "Untitled Position",
    matchScore: interViewReportByAi.matchScore || 0,

    // ✅ q is already {question, answer, intention} — use directly
    technicalQuestions: Array.isArray(interViewReportByAi.technicalQuestions)
        ? interViewReportByAi.technicalQuestions.map(q => ({
            question: typeof q === "string" ? q : q.question,
            answer: typeof q === "string" ? "" : q.answer,
            intention: typeof q === "string" ? "" : q.intention
        }))
        : [],

    // ✅ handle both "behavioralQuestions" and "behaviorQuestions" key
    behaviorQuestions: Array.isArray(interViewReportByAi.behavioralQuestions || interViewReportByAi.behaviorQuestions)
        ? (interViewReportByAi.behavioralQuestions || interViewReportByAi.behaviorQuestions).map(q => ({
            question: typeof q === "string" ? q : q.question,
            answer: typeof q === "string" ? "" : q.answer,
            intention: typeof q === "string" ? "" : q.intention
        }))
        : [],

    // ✅ gap is already {skill, severity} — use directly
    skillGaps: Array.isArray(interViewReportByAi.skillGaps)
        ? interViewReportByAi.skillGaps.map(gap => ({
            skill: typeof gap === "string" ? gap : gap.skill,
            severity: typeof gap === "string" ? "medium" : (gap.severity || "medium")
        }))
        : [],

    // ✅ plan is already {day, focus, tasks[]} — use directly
   preparationPlan: Array.isArray(interViewReportByAi.preparationPlan)
  ? interViewReportByAi.preparationPlan.map((plan, i) => {
      let tasks = [];

      if (typeof plan === "string") {
        tasks = [plan];
      } else if (Array.isArray(plan.tasks)) {
        tasks = plan.tasks.map(t => String(t)); // ✅ force clean strings
      } else if (plan.tasks) {
        tasks = [String(plan.tasks)];
      }

      return {
        day: typeof plan === "string" ? `Day ${i + 1}` : (plan.day || `Day ${i + 1}`),
        focus: typeof plan === "string" ? plan : (plan.focus || "Preparation"),
        tasks
      };
    })
  : []
}

        // 🔍 DEBUG (very important)
        console.log("AI RAW:", interViewReportByAi)
        console.log("FORMATTED:", JSON.stringify(formattedData, null, 2))

        const interviewReport = await interviewReportModel.create(formattedData)

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })

    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            message: "Failed to generate interview report",
            error: error.message
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })

    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            message: "Failed to fetch interview report",
            error: error.message
        })
    }
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviorQuestions -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })

    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            message: "Failed to fetch interview reports",
            error: error.message
        })
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)

    } catch (error) {
        console.error("ERROR:", error)
        res.status(500).json({
            message: "Failed to generate resume PDF",
            error: error.message
        })
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}