"use client"

type StatCardProps = {
  label: string
  value: number | string
  accent?: "red" | "yellow" | "green"
}

export default function StatCard({ label, value, accent }: StatCardProps) {
  const accentMap = {
    red: "text-red-600",
    yellow: "text-yellow-600",
    green: "text-green-600",
  }

  return (
    <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-bold ${accent ? accentMap[accent] : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  )
}
