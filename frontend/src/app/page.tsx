"use client"
export const runtime = "nodejs"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ohi13me-legallens.hf.space/analyze-contract"

import { useState } from "react"

import ExecutiveSummary from "./components/ExecutiveSummary"
import StatCard from "./components/StatCard"
import SectionTitle from "./components/SectionTitle"
import RiskDistribution from "./components/RiskDistribution"
import ClauseCard from "./components/ClauseCard"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeContract = async () => {
    if (!file) {
      setError("Please upload a PDF file")
      return
    }

    setError(null)
    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error(await res.text())

      const data = await res.json()
      setResult({
        clauses: data.clauses || [],
        missing_clauses: data.missing_clauses || [],
        overall_risk: data.overall_risk ?? 0
      })


      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
      }, 150)
    } catch {
      setError("Failed to analyze contract. Ensure backend is running.")
    }

    setLoading(false)
  }

  const downloadReport = async () => {
      if (!result || typeof window === "undefined") return

      const { default: jsPDF } = await import("jspdf")

      const doc = new jsPDF()
      let y = 14

      doc.setFontSize(18)
      doc.text("LegalLens", 14, y)
      y += 10

      doc.setFontSize(12)
      doc.text(`Overall Risk Score: ${result.overall_risk}`, 14, y)
      y += 6
      doc.text(`Clauses Analyzed: ${result.clauses.length}`, 14, y)
      y += 6
      doc.text(`Missing Clauses: ${result.missing_clauses?.length || 0}`, 14, y)
      y += 10

      if ((result.missing_clauses || []).length > 0) {
        doc.setFontSize(13)
        doc.text("Missing Critical Clauses:", 14, y)
        y += 6

        doc.setFontSize(11);
        (result.missing_clauses || []).forEach((c: string) => {
          doc.text(`• ${c}`, 16, y)
          y += 5
        })
        y += 6
      }

  result.clauses.forEach((c: any, i: number) => {
        if (y > 270) {
          doc.addPage()
          y = 14
        }

        doc.setFontSize(13)
        doc.text(`${i + 1}. ${c.clause_type}`, 14, y)
        y += 6

        doc.setFontSize(11)
        doc.text(`Risk Score: ${c.risk_score}`, 16, y)
        y += 5
        doc.text(`Reasons: ${c.reasons.join(", ")}`, 16, y)
        y += 5

        if (c.suggestion) {
          doc.text(`Suggestion: ${c.suggestion}`, 16, y)
          y += 5
        }

        doc.text(c.text.slice(0, 300) + "...", 16, y, { maxWidth: 170 })
        y += 10
      })

      doc.save(`legal-risk-report-${Date.now()}.pdf`)
    }


  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10">

        {/* Header */}
        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
          LegalLens
        </h1>
        <p className="text-slate-600 mb-10">
          Upload a legal contract PDF to receive clause-level risk analysis
        </p>


        {/* Upload */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="flex-1 rounded-lg border border-slate-300 bg-white text-slate-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:bg-slate-900 file:text-white
              hover:file:bg-slate-800"
          />
          <button
            onClick={analyzeContract}
            disabled={loading || !file}
            className="px-8 py-2 rounded-lg bg-slate-900 text-white font-semibold
              hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>

        {error && <div className="mb-6 text-red-600 font-medium">{error}</div>}

        {loading && (
          <div className="mb-6 text-slate-600">
            First analysis may take ~30–60 seconds.
          </div>
        )}

        {!result && !loading && (
          <div className="text-center text-slate-400 mt-24">
            Upload a PDF contract to begin analysis
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div id="results" className="mt-16 border-t pt-12 border-slate-200">

            {/* Executive Summary */}
            <ExecutiveSummary
              overallRisk={result.overall_risk}
              missingCount={result.missing_clauses?.length || 0}
            />


            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard label="Overall Risk" value={result.overall_risk} />
              <StatCard label="Clauses Analyzed" value={result.clauses?.length || 0} />
              <StatCard label="Missing Clauses" value={result.missing_clauses?.length || 0} />
            </div>

            {/* Risk Distribution */}
            <RiskDistribution clauses={result.clauses} />

            {/* Download */}
            <button
              onClick={downloadReport}
              className="mb-12 px-6 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            >
              Download PDF Report
            </button>

            {/* Missing Clauses */}
            <SectionTitle title="Missing Critical Clauses" />

            {result.missing_clauses.length > 0 ? (
              <div className="mb-12 flex flex-wrap gap-3">
                {result.missing_clauses.map((c: string, i: number) => (
                  <span
                    key={i}
                    className="px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold"
                  >
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mb-12 text-green-700 font-medium">
                ✅ No critical clauses missing
              </div>
            )}

            {/* Clause Cards */}
            <SectionTitle title="Clause Risk Analysis" />

            <div className="space-y-6">
              {result.clauses.map((c: any, i: number) => (
                <ClauseCard key={i} clause={c} />
              ))}
            </div>

          </div>
        )}
      </div>
    </main>
  )
}


