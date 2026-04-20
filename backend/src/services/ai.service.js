const Groq = require("groq-sdk");
const puppeteer = require("puppeteer");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
You are an expert technical interviewer and career coach.

Generate a HIGH-QUALITY interview report based on the candidate's resume, job description, and self-description.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

========================
STRICT RULES (MANDATORY)
========================

- NEVER use placeholders like: "Sample answer", "Use STAR method", "TBD", etc.
- Every answer MUST be complete and realistic
- Technical answers MUST include: Concepts, Approach, Trade-offs, Tools/technologies
- Behavioral answers MUST follow STAR method fully written out in first person using candidate's background
- Each question MUST test a DIFFERENT concept
- DO NOT use vague intentions like "Evaluate understanding"
- Generate exactly 5 technical questions and 5 behavioral questions
- Generate exactly 7 days in the preparation plan
- ALL fields must be strings — question, answer, intention are all strings

========================
RESPOND WITH VALID JSON ONLY. NO MARKDOWN. NO EXTRA TEXT. NO CODE BLOCKS.
========================

{
  "title": "string - job title from job description",
  "matchScore": 75,
  "technicalQuestions": [
    {
      "question": "string - a specific technical question",
      "intention": "string - specific skill being evaluated",
      "answer": "string - detailed answer with concepts, approach, trade-offs, tools"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "string - behavioral question",
      "intention": "string - specific competency being evaluated",
      "answer": "string - STAR format answer written in first person using candidate background"
    }
  ],
  "skillGaps": [
    {
      "skill": "string - specific missing skill",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": "Day 1",
      "focus": "string - specific topic",
      "tasks": ["task 1", "task 2", "task 3"]
    }
  ]
}
`;

    const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are an expert technical interviewer. Always respond with valid JSON only. No markdown, no code blocks, no extra text."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 8000,
    });

    const raw = response.choices[0].message.content;
    console.log("RAW AI RESPONSE (first 300 chars):", raw.substring(0, 300));

    if (!raw) throw new Error("Empty response from AI");

    let parsed;
    try {
        // Strip markdown code blocks if present
        const cleaned = raw
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const match = cleaned.match(/\{[\s\S]*\}/);
        const jsonString = match ? match[0] : cleaned;
        parsed = JSON.parse(jsonString);
    } catch (err) {
        console.error("❌ JSON Parse Failed:", raw);
        throw new Error("Invalid JSON returned from AI");
    }

    // Sanitize — ensure questions are valid strings
    const sanitizeQuestions = (arr, label) => {
        if (!Array.isArray(arr)) return [];
        return arr.filter(q => {
            const valid = typeof q.question === "string" && q.question.trim().length > 5;
            if (!valid) console.warn(`⚠️ Skipping invalid ${label} entry:`, q);
            return valid;
        });
    };

    parsed.technicalQuestions = sanitizeQuestions(parsed.technicalQuestions, "technical");
    parsed.behavioralQuestions = sanitizeQuestions(
        parsed.behavioralQuestions || parsed.behaviorQuestions || [],
        "behavioral"
    );
    parsed.skillGaps = Array.isArray(parsed.skillGaps) ? parsed.skillGaps : [];
    parsed.preparationPlan = Array.isArray(parsed.preparationPlan) ? parsed.preparationPlan : [];

    return parsed;
}


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();
    return pdfBuffer;
}


async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate a professional resume in HTML format.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Rules:
- Tailor the resume to the job description
- Highlight relevant skills and experience
- Do NOT sound AI-generated
- Simple, professional design with subtle color accents
- ATS friendly (use divs, not tables for layout)
- 1-2 pages when printed to A4 PDF
- Inline CSS only (no external stylesheets)

Respond ONLY with this JSON (no markdown, no extra text):
{"html": "<full html string here>"}
`;

    const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are a professional resume writer. Always respond with valid JSON only. No markdown, no code blocks."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.5,
        max_tokens: 8000,
    });

    const raw = response.choices[0].message.content;

    let jsonContent;
    try {
        const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
        const match = cleaned.match(/\{[\s\S]*\}/);
        const jsonString = match ? match[0] : cleaned;
        jsonContent = JSON.parse(jsonString);
    } catch (err) {
        throw new Error("Invalid JSON returned for resume HTML");
    }

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };