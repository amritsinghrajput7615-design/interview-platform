import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf
} from "../services/interview.api"

import { useContext, useEffect } from "react"
import { InterviewContext } from "../Interview.context"
import { useParams } from "react-router"

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    // ✅ ALWAYS SAFE VALUES
    const safeReports = Array.isArray(reports) ? reports : []
    const safeReport = report || {}

    // ✅ GENERATE REPORT
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)

        try {
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            // 🔥 FIX: extract interviewReport correctly
            const data = response?.interviewReport || {}

          

            

            setReport(data)

            return data

        } catch (error) {
            console.log(error)
            return {}
        } finally {
            setLoading(false)
        }
    }

    // ✅ GET REPORT BY ID
    const getReportById = async (interviewId) => {
        setLoading(true)

        try {
            const response = await getInterviewReportById(interviewId)

            // 🔥 FIX: extract interviewReport
            const data = response?.interviewReport || {}

            setReport(data)

            return data

        } catch (error) {
            console.log(error)
            return {}
        } finally {
            setLoading(false)
        }
    }

    // ✅ GET ALL REPORTS
    const getReports = async () => {
        setLoading(true)

        try {
            const response = await getAllInterviewReports()

            const data = response || []

            setReports(Array.isArray(data) ? data : [])

            return data

        } catch (error) {
            console.log(error)
            setReports([])
            return []
        } finally {
            setLoading(false)
        }
    }

    // ✅ DOWNLOAD RESUME PDF
    const getResumePdf = async (interviewReportId) => {
        setLoading(true)

        try {
            const blob = await generateResumePdf({ interviewReportId })

            const url = window.URL.createObjectURL(
                new Blob([blob], { type: "application/pdf" })
            )

            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // ✅ AUTO LOAD
    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    return {
        loading,
        report: safeReport,
        reports: safeReports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    }
}