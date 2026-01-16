// "use client"

// export default function RiskDistribution({ clauses }: { clauses: any[] }) {
//   const levels = [
//     { label: "High", color: "bg-red-500", test: (c: any) => c.risk_score > 70 },
//     {
//       label: "Medium",
//       color: "bg-yellow-500",
//       test: (c: any) => c.risk_score > 40 && c.risk_score <= 70,
//     },
//     { label: "Low", color: "bg-green-500", test: (c: any) => c.risk_score <= 40 },
//   ]

//   return (
//     <div className="mb-12">
//       <h2 className="text-lg font-semibold text-slate-900 mb-4">
//         Risk Distribution
//       </h2>

//       {levels.map((l) => {
//         const count = clauses.filter(l.test).length
//         const pct = clauses.length ? (count / clauses.length) * 100 : 0

//         return (
//           <div key={l.label} className="mb-3">
//             <div className="flex justify-between text-sm mb-1 text-slate-700">
//               <span>{l.label} Risk</span>
//               <span>{count}</span>
//             </div>
//             <div className="w-full h-2 bg-slate-200 rounded-full">
//               <div
//                 className={`h-2 rounded-full ${l.color}`}
//                 style={{ width: `${pct}%` }}
//               />
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }
"use client"

import "@/app/lib/chart"

export default function RiskDistribution({ clauses }: { clauses: any[] }) {
  const high = clauses.filter(c => c.risk_score > 70).length
  const medium = clauses.filter(c => c.risk_score > 40 && c.risk_score <= 70).length
  const low = clauses.filter(c => c.risk_score <= 40).length
  const total = clauses.length || 1

  return (
    <div className="mb-12">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Risk Distribution
      </h2>

      {[
        { label: "High", value: high, color: "bg-red-500" },
        { label: "Medium", value: medium, color: "bg-yellow-500" },
        { label: "Low", value: low, color: "bg-green-500" },
      ].map(r => (
        <div key={r.label} className="mb-3">
          <div className="flex justify-between text-sm text-slate-700 mb-1">
            <span>{r.label} Risk</span>
            <span>{r.value}</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full">
            <div
              className={`h-2 rounded-full ${r.color}`}
              style={{ width: `${(r.value / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
