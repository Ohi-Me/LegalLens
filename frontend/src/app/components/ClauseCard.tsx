"use client"

import { useState } from "react"

export default function ClauseCard({ clause }: { clause: any }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-xl font-semibold text-slate-900">
          {clause.clause_type}
        </h3>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              clause.risk_score > 70
                ? "bg-red-100 text-red-700"
                : clause.risk_score > 40
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            Risk {clause.risk_score}
          </span>
          <span className="text-slate-400">
            {open ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {open && (
        <div className="mt-4">
          <p className="text-sm text-slate-700 mb-2">
            <b>Reasons:</b> {clause.reasons.join(", ")}
          </p>

          <p className="text-sm text-slate-800 mb-3">
            {clause.text}
          </p>

          {clause.suggestion && (
            <div className="mt-3 p-3 rounded-lg bg-blue-50 text-blue-800 text-sm">
              <b>Safer Suggestion:</b> {clause.suggestion}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
