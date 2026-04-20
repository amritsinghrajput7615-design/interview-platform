import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'

const NAV_ITEMS = [
    {
        id: 'technical', label: 'Technical Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: 'behavioral', label: 'Behavioral Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: 'roadmap', label: 'Road Map',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${open ? 'border-pink-500/40 bg-[#1a1a2e]' : 'border-white/8 bg-[#12121f] hover:border-white/15'}`}>
            <div
                className="flex items-start gap-4 p-5 cursor-pointer select-none"
                onClick={() => setOpen(o => !o)}
            >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-pink-500/15 text-pink-400 text-xs font-bold flex items-center justify-center border border-pink-500/20">
                    Q{index + 1}
                </span>
                <p className="flex-1 text-[0.93rem] text-gray-200 font-medium leading-snug pt-1">{item.question}</p>
                <span className={`flex-shrink-0 mt-1 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>

            {open && (
                <div className="px-5 pb-5 space-y-4 border-t border-white/6 pt-4">
                    <div>
                        <span className="inline-block text-[10px] font-semibold tracking-widest text-pink-400 uppercase mb-2 border-b border-pink-500/30 pb-0.5">
                            — Intention
                        </span>
                        <p className="text-sm text-gray-400 leading-relaxed">{item.intention}</p>
                    </div>
                    <div>
                        <span className="inline-block text-[10px] font-semibold tracking-wider text-emerald-400 uppercase mb-2 bg-emerald-500/10 px-2 py-0.5 rounded">
                            Model Answer
                        </span>
                        <p className="text-sm text-gray-300 leading-relaxed">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => {
    const tasksArray = typeof day.tasks === 'string'
        ? day.tasks.split('. ')
        : day.tasks

    return (
        <div className="rounded-xl border border-white/8 bg-[#12121f] p-5 hover:border-pink-500/25 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded-md bg-pink-500/15 text-pink-400 text-xs font-bold border border-pink-500/20 uppercase tracking-wider">
                    {day.day}
                </span>
                <h3 className="text-sm font-semibold text-gray-200">{day.focus}</h3>
            </div>
            <ul className="space-y-2.5">
                {tasksArray.map((task, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400 leading-snug">
                        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink-500/60" />
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    )
}

// ── Match Score Ring ──────────────────────────────────────────────────────────

const ScoreRing = ({ score }) => {
    const radius = 44
    const circ = 2 * Math.PI * radius
    const offset = circ - (score / 100) * circ
    const color = score >= 80 ? '#f59e0b' : score >= 60 ? '#10b981' : '#ef4444'

    return (
        <div className="relative inline-flex items-center justify-center w-28 h-28">
            <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
                <circle cx="56" cy="56" r={radius} fill="none" stroke="#ffffff0d" strokeWidth="7" />
                <circle
                    cx="56" cy="56" r={radius} fill="none"
                    stroke={color} strokeWidth="7"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold leading-none" style={{ color }}>{score}</span>
                <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">match</span>
            </div>
        </div>
    )
}

// ── Main Component ─────────────────────────────────────────────────────────────

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()
   

    useEffect(() => {
    if (report && Object.keys(report).length > 0) {
        localStorage.setItem("interviewReport", JSON.stringify(report))
    }
}, [report])

useEffect(() => {
    if (interviewId) {
        getReportById(interviewId)
    } else {
        const saved = localStorage.getItem("interviewReport")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                // you need a setter from your hook OR local state
                console.log("Loaded from localStorage", parsed)
            } catch (e) {
                console.error("Invalid localStorage data")
            }
        }
    }
}, [interviewId])

    

    const safeReport = {
        technicalQuestions: [],
        behaviorQuestions: [],
        preparationPlan: [],
        skillGaps: [],
        matchScore: 0,
        ...report
    }

    if (loading || !report || Object.keys(report).length === 0) {
        return (
            <main className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 text-sm">Loading your interview plan...</p>
                </div>
            </main>
        )
    }

    const scoreColor = safeReport.matchScore >= 80 ? 'text-amber-400' :
        safeReport.matchScore >= 60 ? 'text-emerald-400' : 'text-red-400'

    const scoreBadge = safeReport.matchScore >= 80 ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
        safeReport.matchScore >= 60 ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
            'bg-red-400/10 text-red-400 border-red-400/20'

    const scoreLabel = safeReport.matchScore >= 80 ? 'Strong Match' :
        safeReport.matchScore >= 60 ? 'Good Match' : 'Needs Work'

    const severityColor = (sev) => {
        if (sev === 'high') return 'bg-red-500/10 text-red-400 border border-red-500/20'
        if (sev === 'medium') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
    }

    return (
        <div className="min-h-screen bg-[#0d0d1a] text-white font-sans">
            {/* Top status bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600" />

            <div className="flex h-[calc(100vh-2px)]">

                {/* ── Left Nav ── */}
                <aside className="w-56 flex-shrink-0 flex flex-col border-r border-white/6 bg-[#0d0d1a] px-3 py-5">
                    {/* Logo */}
                    <div className="px-2 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-pink-500" />
                            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Interview</span>
                        </div>
                    </div>

                    {/* Info block */}
                    <div className="mx-2 mb-5 p-3 rounded-lg bg-white/4 border border-white/6">
                        <p className="text-[10px] font-bold tracking-widest text-pink-400 uppercase mb-0.5">Intelligence</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">V3.2.0 · Senior Frontend</p>
                    </div>

                    <p className="px-2 text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-2">Sections</p>

                    <nav className="flex-1 space-y-0.5">
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveNav(item.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-left
                                    ${activeNav === item.id
                                        ? 'bg-pink-500/15 text-pink-400 border border-pink-500/20 font-medium'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/4'
                                    }`}
                            >
                                <span className={activeNav === item.id ? 'text-pink-400' : 'text-gray-600'}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Download button */}
                    <button
                        onClick={() => getResumePdf(interviewId)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-pink-400 hover:bg-pink-500/8 transition-all duration-150 border border-transparent hover:border-pink-500/15"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Resume
                    </button>
                </aside>

                {/* ── Center Content ── */}
                <main className="flex-1 overflow-y-auto px-8 py-7">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-7">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-xl font-bold text-white">
                                    {activeNav === 'technical' && 'Technical Questions'}
                                    {activeNav === 'behavioral' && 'Behavioral Questions'}
                                    {activeNav === 'roadmap' && 'Preparation Road Map'}
                                </h1>
                                {activeNav !== 'roadmap' && (
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                        COMPLETED
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">Assessment results — Interview Plan</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            {activeNav === 'technical' && <span>{safeReport.technicalQuestions.length} questions</span>}
                            {activeNav === 'behavioral' && <span>{safeReport.behaviorQuestions.length} questions</span>}
                            {activeNav === 'roadmap' && <span>{safeReport.preparationPlan?.length || 0}-day plan</span>}
                        </div>
                    </div>

                    {/* Question lists */}
                    <div className="space-y-3 max-w-2xl">
                        {activeNav === 'technical' && safeReport.technicalQuestions.map((q, i) => (
                            <QuestionCard key={i} item={q} index={i} />
                        ))}
                        {activeNav === 'behavioral' && safeReport.behaviorQuestions.map((q, i) => (
                            <QuestionCard key={i} item={q} index={i} />
                        ))}
                        {activeNav === 'roadmap' && (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {safeReport.preparationPlan?.map((day, i) => (
                                    <RoadMapDay key={day.day || i} day={day} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {/* ── Right Sidebar ── */}
                <aside className="w-64 flex-shrink-0 border-l border-white/6 bg-[#0d0d1a] px-5 py-6 overflow-y-auto">

                    {/* Match Score */}
                    <div className="mb-6">
                        <p className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase mb-4">Candidate Match Score</p>
                        <div className="flex flex-col items-center gap-3">
                            <ScoreRing score={safeReport.matchScore} />
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wider uppercase ${scoreBadge}`}>
                                {scoreLabel}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-3 leading-relaxed">
                            Candidate exceeds baseline for <span className="text-gray-300 font-medium">4/5 core competencies</span> required for this engineering level.
                        </p>
                    </div>

                    <div className="h-px bg-white/6 mb-5" />

                    {/* Skill Gaps */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            <p className="text-xs font-semibold text-gray-300">Skill Gaps</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {safeReport.skillGaps.map((gap, i) => (
                                <span key={i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${severityColor(gap.severity)}`}>
                                    {gap.skill}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-white/6 mb-5" />

                    {/* Strategic Recommendation */}
                    <div>
                        <p className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase mb-3">Strategic Recommendation</p>
                        <div className="flex gap-2.5">
                            <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Focus next interview rounds on deep-diving into{' '}
                                <span className="text-pink-400 font-medium">testing strategy</span>{' '}
                                and infrastructure orchestration experience.
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-white/6 my-5" />

                    {/* Create New Interview CTA */}
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 transition-colors duration-150 text-white text-sm font-semibold shadow-lg shadow-pink-500/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Create New Interview
                    </button>
                </aside>
            </div>
        </div>
    )
}

export default Interview
