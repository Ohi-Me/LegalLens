"use client"

type Props = {
  overallRisk: number
  missingCount: number
}

export default function ExecutiveSummary({
  overallRisk,
  missingCount,
}: Props) {
  return (
    <div className="mb-10 p-6 rounded-xl bg-slate-900 text-white">
      <h2 className="text-lg font-semibold mb-2">
        Executive Risk Summary
      </h2>
      <p className="text-sm text-slate-200">
        This contract has an overall risk score of{" "}
        <b>{overallRisk}</b>.{" "}
        {missingCount > 0
          ? `${missingCount} critical clauses are missing.`
          : "No critical clauses are missing."}
      </p>
    </div>
  )
}
